from sqlalchemy.orm import Session
from fastapi import HTTPException
from schemas.transaction import TransactionCreate
from repositories.transaction_repository import TransactionRepository

class TransactionService:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def get_all(self, db: Session, user_id: int, skip: int = 0, limit: int = 100):
        return self.repo.get_all_for_user(db, user_id, skip, limit)

    def create(self, db: Session, transaction: TransactionCreate, user_id: int):
        return self.repo.create_for_user(db, transaction, user_id)

    def delete(self, db: Session, transaction_id: int, user_id: int):
        db_transaction = self.repo.get_by_id(db, transaction_id, user_id)
        if not db_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        self.repo.delete(db, db_transaction)
        return {"detail": "Transaction deleted successfully"}

    def get_summary(self, db: Session, user_id: int):
        balance, total_income, total_expense = self.repo.get_summary_for_user(db, user_id)
        return {
            "balance": balance / 100.0,
            "total_income": total_income / 100.0,
            "total_expense": total_expense / 100.0
        }
