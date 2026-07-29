from sqlalchemy.orm import Session
from models.chat_history import ChatHistory
from typing import List

class ChatRepository:
    def get_history(self, db: Session, user_id: int, limit: int = 5) -> List[ChatHistory]:
        return db.query(ChatHistory).filter(ChatHistory.user_id == user_id)\
                 .order_by(ChatHistory.created_at.desc()).limit(limit).all()

    def save_message(self, db: Session, user_id: int, message: str, response: str) -> ChatHistory:
        db_msg = ChatHistory(user_id=user_id, message=message, response=response)
        db.add(db_msg)
        db.commit()
        db.refresh(db_msg)
        return db_msg
