import os
from .base import AIProvider

def get_ai_provider() -> AIProvider:
    provider = os.getenv("AI_PROVIDER", "gemini").lower()
    
    if provider == "gemini":
        from .providers.gemini_provider import GeminiProvider
        return GeminiProvider()
    elif provider == "openai":
        # Placeholder for OpenAI implementation
        raise NotImplementedError("OpenAI provider not yet implemented")
    else:
        raise ValueError(f"Unknown AI Provider: {provider}")
