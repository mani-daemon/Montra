from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from schemas.transaction import TransactionCreate, TransactionResponse
from models.user import UserModel
from core.database import get_db
from core.dependencies import get_current_user, get_transaction_service
from services.transaction_service import TransactionService

router = APIRouter(prefix="/api/v1/transactions", tags=["Transactions"])

@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    transaction_service: TransactionService = Depends(get_transaction_service)
):
    return transaction_service.get_summary(db, current_user.id)

@router.get("", response_model=List[TransactionResponse])
def get_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    transaction_service: TransactionService = Depends(get_transaction_service)
):
    return transaction_service.get_all(db, current_user.id, skip, limit)

@router.post("", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    transaction_service: TransactionService = Depends(get_transaction_service)
):
    return transaction_service.create(db, transaction, current_user.id)

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    transaction_service: TransactionService = Depends(get_transaction_service)
):
    return transaction_service.delete(db, transaction_id, current_user.id)
