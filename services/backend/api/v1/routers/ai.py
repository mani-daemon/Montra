from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from models.user import UserModel
from schemas.chat import ChatRequest
from core.database import get_db
from core.dependencies import get_current_user, get_ai_service
from services.ai_service import AIService

router = APIRouter(prefix="/api/v1/ai", tags=["AI"])

@router.post("/receipts/analyze")
async def analyze_receipt_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
):
    if not file.content_type.startswith('image/'):
        raise HTTPException(400, "File must be an image")
    text = f"Simulated OCR text for {file.filename}"
    return ai_service.analyze_receipt(text)

@router.post("/assistant/chat")
async def chat_endpoint(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
):
    return ai_service.chat(db, current_user.id, req.message)

@router.get("/insights")
async def get_insights(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
):
    return ai_service.generate_insight(db, current_user.id)
