from fastapi import APIRouter, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserResponse
from schemas.token import Token
from core.database import get_db
from core.dependencies import get_auth_service
from services.auth_service import AuthService

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate, 
    db: Session = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    return auth_service.register_user(db, user)

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    return auth_service.login_user(db, form_data)

@router.post("/refresh", response_model=Token)
def refresh_token(
    refresh_token: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    return auth_service.refresh_token(db, refresh_token)
