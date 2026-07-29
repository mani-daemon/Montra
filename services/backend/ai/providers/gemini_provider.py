import os
import json
from ai.base import AIProvider
from google import genai
from google.genai import types

class GeminiProvider(AIProvider):
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.model_name = "gemini-flash-latest"
        self.mock_mode = False
        
        if not self.api_key:
            self.mock_mode = True
            self.client = None
        else:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception:
                self.mock_mode = True
                self.client = None

    def analyze_receipt(self, image_bytes: bytes, mime_type: str) -> dict:
        if self.mock_mode:
            return {
                "merchant_name": "Mock Merchant",
                "total_amount": 120.50,
                "tax_amount": 10.0,
                "date": "2026-07-29",
                "confidence": 0.95,
                "items": [{"name": "Mock Item", "price": 110.50}]
            }

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
        
        try:
            data = json.loads(response.text)
            # Validate JSON structure
            if not all(k in data for k in ['merchant_name', 'total_amount', 'date']):
                raise ValueError("Invalid receipt data structure from AI")
            return data
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON response from AI")
        except Exception as e:
            raise ValueError(f"AI analysis failed: {str(e)}")

    def chat(self, prompt: str, user_transactions: list, language: str = "en") -> str:
        if self.mock_mode:
            return "This is a mock response. The AI provider is not configured properly."

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
        Respond in language: {language}.
        
        {tx_context}
        """
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[system_instruction, prompt],
        )
        return response.text

    def get_insights(self, summary_data: dict) -> str:
        if self.mock_mode:
            return "Mock Insight: Keep tracking your expenses to build wealth!"

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
