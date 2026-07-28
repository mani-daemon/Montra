from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
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

# 1. Get all transactions
@app.get("/transactions", response_model=List[schemas.TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(models.TransactionModel).order_by(models.TransactionModel.id.desc()).all()

# 2. Create a new transaction
@app.post("/transactions", response_model=schemas.TransactionResponse)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    db_item = models.TransactionModel(**transaction.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# 3. Get total balance summary
@app.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    transactions = db.query(models.TransactionModel).all()
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = total_income - total_expense
    return {
        "balance": balance,
        "total_income": total_income,
        "total_expense": total_expense
    }