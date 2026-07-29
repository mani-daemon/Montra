from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import decode_access_token
from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository
from services.auth_service import AuthService
from services.transaction_service import TransactionService
from services.ai_service import AIService
from models.user import UserModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

from repositories.chat_repository import ChatRepository

def get_user_repository() -> UserRepository:
    return UserRepository()

def get_transaction_repository() -> TransactionRepository:
    return TransactionRepository()

def get_chat_repository() -> ChatRepository:
    return ChatRepository()

def get_auth_service(repo: UserRepository = Depends(get_user_repository)) -> AuthService:
    return AuthService(repo)

def get_transaction_service(repo: TransactionRepository = Depends(get_transaction_repository)) -> TransactionService:
    return TransactionService(repo)

def get_ai_service(
    repo: TransactionRepository = Depends(get_transaction_repository),
    chat_repo: ChatRepository = Depends(get_chat_repository),
    user_repo: UserRepository = Depends(get_user_repository)
) -> AIService:
    return AIService(repo, chat_repo, user_repo)

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db),
    repo: UserRepository = Depends(get_user_repository)
) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = decode_access_token(token)
    if user_id is None:
        raise credentials_exception
    
    user = repo.get_by_id(db, user_id)
    if user is None:
        raise credentials_exception
    return user
