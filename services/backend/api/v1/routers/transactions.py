from fastapi import APIRouter, Depends, status, Request
from fastapi_cache.decorator import cache
from sqlalchemy.orm import Session
from typing import List

from schemas.transaction import TransactionCreate, TransactionResponse
from models.user import UserModel
from core.database import get_db
from core.dependencies import get_current_user, get_transaction_service
from services.transaction_service import TransactionService

router = APIRouter(prefix="/api/v1/transactions", tags=["Transactions"])

@router.get("/summary")
@cache(expire=60)
def get_summary(
    request: Request,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    transaction_service: TransactionService = Depends(get_transaction_service)
):
    return transaction_service.get_summary(db, current_user.id)

from schemas.page import Page
from fastapi import Query

@router.get("/", response_model=Page[TransactionResponse])
def get_transactions(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    transaction_service: TransactionService = Depends(get_transaction_service)
):
    skip = (page - 1) * size
    transactions = transaction_service.get_all(db, current_user.id, skip, size)
    total = transaction_service.count(db, current_user.id)
    return Page(items=transactions, total=total, page=page, size=size)

@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
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
