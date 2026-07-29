from datetime import datetime, timedelta, timezone
from uuid import uuid4
from jose import JWTError, jwt
from core.config import settings
import bcrypt

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def _create_token(user_id: int, token_type: str, expires_delta: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "type": token_type,
        "jti": str(uuid4()),
        "iat": now,
        "exp": now + expires_delta,
        "iss": "montra-api",
        "aud": "montra-mobile",
    }
    return jwt.encode(payload, settings.jwt_secret(), algorithm=settings.ALGORITHM)


def create_access_token(user_id: int) -> str:
    return _create_token(user_id, "access", timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))

def create_refresh_token(user_id: int) -> str:
    return _create_token(user_id, "refresh", timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))

def decode_access_token(token: str, expected_type: str = "access") -> int | None:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret(),
            algorithms=[settings.ALGORITHM],
            issuer="montra-api",
            audience="montra-mobile",
        )
        if payload.get("type") != expected_type:
            return None
        return int(payload["sub"])
    except JWTError:
        return None
    except (KeyError, TypeError, ValueError):
        return None
