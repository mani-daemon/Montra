from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class CategoryEnum(str, Enum):
    food = "Food"
    shopping = "Shopping"
    salary = "Salary"
    entertainment = "Entertainment"
    transport = "Transport"
    general = "General"

class TransactionBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    amount_minor: int = Field(gt=0, le=10**12)
    type: str = Field(pattern="^(income|expense)$")
    category: CategoryEnum = CategoryEnum.general
    description: str | None = Field(default=None, max_length=500)

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True
