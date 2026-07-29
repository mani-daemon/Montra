from sqlalchemy.orm import Session
from typing import Dict, Any, List
from ai.factory import get_ai_provider
from repositories.transaction_repository import TransactionRepository
from repositories.chat_repository import ChatRepository
from repositories.user_repository import UserRepository

class AIService:
    def __init__(self, repo: TransactionRepository, chat_repo: ChatRepository, user_repo: UserRepository):
        self.repo = repo
        self.chat_repo = chat_repo
        self.user_repo = user_repo
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

    def chat(self, db: Session, user_id: int, message: str) -> Dict[str, Any]:
        user = self.user_repo.get_by_id(db, user_id)
        # Using a fixed default or derived from user settings if available
        language = "fa" if getattr(user, "language", "fa") == "fa" else "en"

        history = self.chat_repo.get_history(db, user_id, limit=5)
        recent_tx = self.repo.get_all_for_user(db, user_id, limit=50)
        
        # We append history to the prompt if needed, or rely on the provider
        # For GeminiProvider, it doesn't natively take history, but we can prepend it to the prompt.
        context_msg = "Conversation History:\n"
        for h in reversed(history):
            context_msg += f"User: {h.message}\nAI: {h.response}\n"
        context_msg += f"\nUser: {message}"

        response = self.provider.chat(context_msg, recent_tx, language=language)
        
        # Save to DB
        self.chat_repo.save_message(db, user_id, message, response)
        
        # Serialize history for response
        hist_serialized = [{"role": "user", "text": h.message} for h in history] + [{"role": "ai", "text": h.response} for h in history]
        
        return {"response": response, "history": hist_serialized}
