from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

import models
import schemas
import auth
from database import engine, get_db, Base

# Create database tables directly from Base
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Montra Financial API")

# Configure CORS for mobile app connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Montra API 🚀"}

# --- AUTH ROUTES ---

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.UserModel).filter(models.UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.UserModel(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.UserModel).filter(models.UserModel.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- TRANSACTION ROUTES ---

@app.get("/transactions", response_model=List[schemas.TransactionResponse])
def get_transactions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    return db.query(models.TransactionModel)\
        .filter(models.TransactionModel.user_id == current_user.id)\
        .order_by(models.TransactionModel.id.desc())\
        .offset(skip).limit(limit).all()

@app.post("/transactions", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction: schemas.TransactionCreate, 
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    db_item = models.TransactionModel(**transaction.model_dump(), user_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    # Optimize summary calculation using SQL aggregations instead of loading all rows
    total_income = db.query(func.sum(models.TransactionModel.amount))\
        .filter(models.TransactionModel.user_id == current_user.id, models.TransactionModel.type == "income")\
        .scalar() or 0.0
        
    total_expense = db.query(func.sum(models.TransactionModel.amount))\
        .filter(models.TransactionModel.user_id == current_user.id, models.TransactionModel.type == "expense")\
        .scalar() or 0.0

    balance = total_income - total_expense
    return {
        "balance": balance,
        "total_income": total_income,
        "total_expense": total_expense
    }