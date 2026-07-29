from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from models.user import UserModel
from schemas.chat import ChatRequest
from core.database import get_db
from core.dependencies import get_current_user, get_ai_service
from services.ai_service import AIService

router = APIRouter(prefix="/api/v1/ai", tags=["AI"])
MAX_RECEIPT_BYTES = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}

@router.post("/receipts/analyze")
async def analyze_receipt_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(415, "Only JPEG, PNG and WebP images are supported")

    image_bytes = await file.read(MAX_RECEIPT_BYTES + 1)
    if not image_bytes:
        raise HTTPException(400, "Receipt image is empty")
    if len(image_bytes) > MAX_RECEIPT_BYTES:
        raise HTTPException(413, "Receipt image must not exceed 10 MB")
    return ai_service.analyze_receipt(image_bytes, file.content_type)

from fastapi.responses import StreamingResponse

@router.post("/assistant/chat")
async def chat_endpoint(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
):
    return ai_service.chat(db, current_user.id, req.message)

@router.post("/assistant/chat/stream")
async def chat_stream_endpoint(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
):
    async def event_generator():
        async for chunk in ai_service.stream_chat(db, current_user.id, req.message):
            # Server-Sent Events format
            yield f"data: {chunk}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/insights")
async def get_insights(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service)
):
    return ai_service.generate_insight(db, current_user.id)
