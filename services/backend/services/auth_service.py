from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from schemas.user import UserCreate
from schemas.token import Token
from core.security import verify_password, create_access_token, create_refresh_token, decode_access_token
from repositories.user_repository import UserRepository

class AuthService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    def register_user(self, db: Session, user_data: UserCreate):
        db_user = self.repo.get_by_email(db, user_data.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        return self.repo.create(db, user_data)

    def login_user(self, db: Session, form_data: OAuth2PasswordRequestForm) -> Token:
        user = self.repo.get_by_email(db, form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        
        return Token(
            access_token=access_token, 
            token_type="bearer",
            refresh_token=refresh_token
        )
        
    def refresh_token(self, db: Session, refresh_token: str) -> Token:
        user_id = decode_access_token(refresh_token, expected_type="refresh")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        user = self.repo.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        new_access_token = create_access_token(user.id)
        new_refresh_token = create_refresh_token(user.id)
        return Token(
            access_token=new_access_token,
            token_type="bearer",
            refresh_token=new_refresh_token
        )
