from pydantic import BaseModel
from datetime import datetime

class TransactionBase(BaseModel):
    title: str
    amount: float
    type: str
    category: str = "General"

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True