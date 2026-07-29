from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Montra Backend"
    ENVIRONMENT: str = "development" # "development" or "production"
    
    # CORS settings
    CORS_ORIGINS: list = [
        "https://api.montra.app",
        "https://montra.app",
        "http://localhost",
        "http://localhost:8081",
        "http://127.0.0.1",
        "http://127.0.0.1:8081",
        "exp://127.0.0.1:8081"
    ]

    SECRET_KEY: str = "super-secret-jwt-key-montra-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
