from sqlalchemy.orm import Session
from typing import Optional
from models.user import UserModel
from schemas.user import UserCreate
from core.security import get_password_hash

class UserRepository:
    def get_by_id(self, db: Session, user_id: int) -> Optional[UserModel]:
        return db.query(UserModel).filter(UserModel.id == user_id).first()

    def get_by_email(self, db: Session, email: str) -> Optional[UserModel]:
        return db.query(UserModel).filter(UserModel.email == email).first()

    def create(self, db: Session, user: UserCreate) -> UserModel:
        hashed_password = get_password_hash(user.password)
        db_user = UserModel(email=user.email, full_name=user.full_name, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
