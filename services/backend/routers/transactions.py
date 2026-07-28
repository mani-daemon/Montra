from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

import models
import schemas
import auth
from database import get_db

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
    dependencies=[Depends(auth.get_current_user)]
)

@router.get("/", response_model=List[schemas.TransactionResponse])
def read_transactions(
    db: Session = Depends(get_db), 
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    transactions = db.query(models.TransactionModel).filter(
        models.TransactionModel.user_id == current_user.id
    ).order_by(models.TransactionModel.created_at.desc()).all()
    return transactions

@router.post("/", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction: schemas.TransactionCreate, 
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    db_transaction = models.TransactionModel(
        **transaction.model_dump(),
        user_id=current_user.id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.put("/{transaction_id}", response_model=schemas.TransactionResponse)
def update_transaction(
    transaction_id: int, 
    transaction: schemas.TransactionCreate, 
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    db_transaction = db.query(models.TransactionModel).filter(
        models.TransactionModel.id == transaction_id,
        models.TransactionModel.user_id == current_user.id
    ).first()
    
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    for key, value in transaction.model_dump().items():
        setattr(db_transaction, key, value)
        
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int, 
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    db_transaction = db.query(models.TransactionModel).filter(
        models.TransactionModel.id == transaction_id,
        models.TransactionModel.user_id == current_user.id
    ).first()
    
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}

@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    # Use SQL SUM() directly
    income_sum = db.query(func.sum(models.TransactionModel.amount)).filter(
        models.TransactionModel.user_id == current_user.id,
        models.TransactionModel.type == "Income"
    ).scalar() or 0
    
    expense_sum = db.query(func.sum(models.TransactionModel.amount)).filter(
        models.TransactionModel.user_id == current_user.id,
        models.TransactionModel.type == "Expense"
    ).scalar() or 0

    return {
        "income": income_sum,
        "expense": expense_sum,
        "balance": income_sum - expense_sum
    }
