from sqlalchemy.orm import Session
from typing import Dict, Any
from ai.factory import get_ai_provider
from repositories.transaction_repository import TransactionRepository

class AIService:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo
        self.provider = get_ai_provider()

    def analyze_receipt(self, image_bytes: bytes, mime_type: str) -> Dict[str, Any]:
        return self.provider.analyze_receipt(image_bytes, mime_type)

    def generate_insight(self, db: Session, user_id: int) -> Dict[str, str]:
        balance, total_income, total_expense = self.repo.get_summary_for_user(db, user_id)
        insight = self.provider.get_insights({
            "balance": balance,
            "income": total_income,
            "expense": total_expense,
        })
        return {"insight": insight}

    def chat(self, db: Session, user_id: int, message: str) -> Dict[str, str]:
        balance, total_income, total_expense = self.repo.get_summary_for_user(db, user_id)
        # Keep the provider contract typed: it receives transaction models, not
        # a pre-formatted string that it cannot inspect safely.
        recent = self.repo.get_all_for_user(db, user_id, limit=50)
        return {"response": self.provider.chat(message, recent)}
