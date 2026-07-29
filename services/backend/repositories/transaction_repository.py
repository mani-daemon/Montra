from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List, Optional, Tuple
from models.transaction import TransactionModel
from schemas.transaction import TransactionCreate

class TransactionRepository:
    def get_all_for_user(self, db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[TransactionModel]:
        return db.query(TransactionModel).filter(TransactionModel.user_id == user_id).order_by(TransactionModel.id.desc()).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, transaction_id: int, user_id: int) -> Optional[TransactionModel]:
        return db.query(TransactionModel).filter(TransactionModel.id == transaction_id, TransactionModel.user_id == user_id).first()

    def create_for_user(self, db: Session, transaction: TransactionCreate, user_id: int) -> TransactionModel:
        db_transaction = TransactionModel(**transaction.dict(), user_id=user_id)
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction

    def delete(self, db: Session, db_transaction: TransactionModel):
        db.delete(db_transaction)
        db.commit()

    def get_summary_for_user(self, db: Session, user_id: int) -> Tuple[int, int, int]:
        total_income = db.query(func.sum(TransactionModel.amount)).filter(
            TransactionModel.user_id == user_id, 
            TransactionModel.type == "income"
        ).scalar() or 0

        total_expense = db.query(func.sum(TransactionModel.amount)).filter(
            TransactionModel.user_id == user_id, 
            TransactionModel.type == "expense"
        ).scalar() or 0

        balance = total_income - total_expense
        return balance, total_income, total_expense
