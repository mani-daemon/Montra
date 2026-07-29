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

app = FastAPI(title="Montra V2 (Layered Architecture)")

# Force HTTPS in production
if settings.ENVIRONMENT == "production":
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
def root():
    return {"message": "Welcome to Montra API V2 (Layered Architecture) 🚀"}