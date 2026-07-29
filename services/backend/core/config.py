import secrets

from pydantic import SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Montra Backend"
    ENVIRONMENT: str = "development"
    
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

    # A missing key is allowed only for local development so the repository can
    # be cloned safely. Production must always inject a real secret.
    SECRET_KEY: SecretStr | None = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # Architecture and Security Additions
    DATABASE_URL: str = "sqlite:///./montra_dev.db"
    FORCE_HTTPS: bool = False
    REDIS_URL: str = "redis://localhost:6379/0"

    @model_validator(mode="after")
    def require_secret_in_production(self):
        if self.ENVIRONMENT.lower() == "production":
            if self.SECRET_KEY is None or len(self.SECRET_KEY.get_secret_value()) < 32:
                raise ValueError("SECRET_KEY must be at least 32 characters in production")
        return self

    def jwt_secret(self) -> str:
        if self.SECRET_KEY:
            return self.SECRET_KEY.get_secret_value()
        # Never use this outside a local machine. It intentionally changes on
        # each restart so a forgotten secret cannot become a production key.
        if self.ENVIRONMENT.lower() == "production":
            raise RuntimeError("SECRET_KEY is required in production")
        return _development_jwt_secret

settings = Settings()
# Local-only ephemeral secret. Keep it module scoped so all requests issued
# during one development process can validate each other's tokens.
_development_jwt_secret = secrets.token_urlsafe(48)
