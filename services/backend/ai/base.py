from abc import ABC, abstractmethod
from typing import List, Dict, Any

class AIProvider(ABC):
    @abstractmethod
    def analyze_receipt(self, image_bytes: bytes, mime_type: str) -> Dict[str, Any]:
        """
        Analyzes a receipt image and extracts structured data.
        Returns a dictionary matching the ReceiptData schema.
        """
        pass

    @abstractmethod
    def chat(self, prompt: str, user_transactions: List[Any]) -> str:
        """
        Processes a chat message with the given user context.
        """
        pass

    @abstractmethod
    def get_insights(self, summary_data: Dict[str, Any]) -> str:
        """
        Generates a short financial insight based on the user's spending summary.
        """
        pass
