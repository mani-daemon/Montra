from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "super-secret-jwt-key-montra-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
