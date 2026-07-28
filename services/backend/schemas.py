from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from enum import Enum

class CategoryEnum(str, Enum):
    food = "Food"
    shopping = "Shopping"
    salary = "Salary"
    entertainment = "Entertainment"
    transport = "Transport"
    general = "General"

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    title: str
    amount: float
    type: str
    category: CategoryEnum = CategoryEnum.general

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime
    user_id: int

    @field_validator('amount', mode='before')
    def convert_cents_to_float(cls, v):
        # Database stores amount as integer cents, API outputs float
        if isinstance(v, int):
            return v / 100.0
        return v

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str