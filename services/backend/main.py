import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import models
from core.database import engine, Base
from api.v1.routers import auth, transactions, ai

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from core.middlewares import SecurityHeadersMiddleware
from core.config import settings

# Rate Limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Caching
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Montra V2 (Layered Architecture)")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url(settings.REDIS_URL, encoding="utf8", decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")

# Force HTTPS in production or if FORCE_HTTPS is true
if settings.ENVIRONMENT == "production" or settings.FORCE_HTTPS:
    app.add_middleware(HTTPSRedirectMiddleware)

# Add security headers
app.add_middleware(SecurityHeadersMiddleware)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred"},
    )

# Include Routers
app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(ai.router)

@app.get("/")
@limiter.limit("5/minute")
def root(request: Request):
    return {"message": "Welcome to Montra API V2 (Layered Architecture) 🚀"}