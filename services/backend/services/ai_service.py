from sqlalchemy.orm import Session
from typing import Dict, Any
from ai.factory import get_ai_provider
from repositories.transaction_repository import TransactionRepository

class AIService:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo
        self.provider = get_ai_provider()

    def analyze_receipt(self, text: str) -> Dict[str, Any]:
        return self.provider.analyze_receipt(text)

    def generate_insight(self, db: Session, user_id: int) -> Dict[str, str]:
        balance, total_income, total_expense = self.repo.get_summary_for_user(db, user_id)
        return self.provider.generate_insight(balance, total_income, total_expense)

    def chat(self, db: Session, user_id: int, message: str) -> Dict[str, str]:
        balance, total_income, total_expense = self.repo.get_summary_for_user(db, user_id)
        # Fetch some recent transactions for context
        recent = self.repo.get_all_for_user(db, user_id, limit=5)
        # Format context
        ctx = f"Balance: {balance/100}\nIncome: {total_income/100}\nExpense: {total_expense/100}\nRecent transactions:\n"
        for t in recent:
            ctx += f"- {t.title}: {t.amount/100} ({t.category})\n"
        
        return self.provider.chat(message, ctx)
