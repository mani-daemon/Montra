from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base

class TransactionModel(Base):
    __tablename__ = "transactions"
    __table_args__ = (
        Index("ix_transaction_user_time", "user_id", "created_at"),
    )

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True, nullable=False)
    amount = Column(Integer, nullable=False)  # ISO-4217 minor units; never float
    type = Column(String(20), index=True, nullable=False)  # 'income' or 'expense'
    category = Column(String(100), index=True, default="General")
    description = Column(String(500))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    owner = relationship("UserModel", back_populates="transactions")

    @property
    def amount_minor(self) -> int:
        return self.amount
