from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class TransactionModel(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    amount = Column(Float)
    type = Column(String)  # 'income' or 'expense'
    category = Column(String, default="General")
    created_at = Column(DateTime, default=datetime.utcnow)