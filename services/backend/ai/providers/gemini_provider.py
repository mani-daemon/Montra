import os
import json
from ai.base import AIProvider
from google import genai
from google.genai import types

class GeminiProvider(AIProvider):
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is not set")
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = "gemini-flash-latest"

    def analyze_receipt(self, image_bytes: bytes, mime_type: str) -> dict:
        prompt = """
        Analyze this receipt and extract the following information.
        Return ONLY a valid JSON object with this exact structure, nothing else:
        {
          "merchant_name": "string",
          "total_amount": float,
          "tax_amount": float,
          "date": "YYYY-MM-DD",
          "confidence": float,
          "items": [
            {
              "name": "string",
              "price": float
            }
          ]
        }
        """
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                prompt
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        
        data = json.loads(response.text)
        return data

    def chat(self, prompt: str, user_transactions: list) -> str:
        tx_context = "User's Recent Transactions:\n"
        if not user_transactions:
            tx_context += "No transactions yet.\n"
        else:
            for t in user_transactions:
                tx_context += f"- {t.title}: ${t.amount/100:.2f} ({t.category}, {t.type})\n"
                
        system_instruction = f"""
        You are Montra AI, a highly intelligent, supportive, and concise personal finance advisor.
        Answer the user's question based on their transaction history below.
        Keep your answers short (2-3 sentences max) and conversational. Do not use markdown headers.
        
        {tx_context}
        """
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[system_instruction, prompt],
        )
        return response.text

    def get_insights(self, summary_data: dict) -> str:
        prompt = f"""
        You are Montra AI. Based on the user's current summary:
        Income: ${summary_data.get('income', 0)/100:.2f}
        Expenses: ${summary_data.get('expense', 0)/100:.2f}
        Provide one short, encouraging, and actionable financial tip or insight (max 1 sentence).
        """
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[prompt],
        )
        return response.text.strip()
