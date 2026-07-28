from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
import schemas
import auth
from database import get_db
from ai.factory import get_ai_provider

router = APIRouter(
    prefix="/ai",
    tags=["AI Features"],
    dependencies=[Depends(auth.get_current_user)]
)

@router.post("/receipts/analyze")
async def analyze_receipt(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        provider = get_ai_provider()
        result = provider.analyze_receipt(image_bytes=contents, mime_type=file.content_type)
        return result
    except Exception as e:
        print(f"AI Scan Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze receipt. Check API Key.")

@router.post("/assistant/chat")
def chat_with_assistant(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    try:
        transactions = db.query(models.TransactionModel).filter(
            models.TransactionModel.user_id == current_user.id
        ).order_by(models.TransactionModel.created_at.desc()).limit(30).all()
        
        provider = get_ai_provider()
        response_text = provider.chat(request.message, transactions)
        return {"response": response_text}
    except Exception as e:
        print(f"AI Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to communicate with AI.")

@router.get("/insights")
def get_insight(
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(auth.get_current_user)
):
    try:
        income_sum = db.query(func.sum(models.TransactionModel.amount)).filter(
            models.TransactionModel.user_id == current_user.id,
            models.TransactionModel.type == "Income"
        ).scalar() or 0
        
        expense_sum = db.query(func.sum(models.TransactionModel.amount)).filter(
            models.TransactionModel.user_id == current_user.id,
            models.TransactionModel.type == "Expense"
        ).scalar() or 0
        
        summary = {"income": income_sum, "expense": expense_sum}
        provider = get_ai_provider()
        insight_text = provider.get_insights(summary)
        return {"insight": insight_text}
    except Exception as e:
        print(f"AI Insight Error: {str(e)}")
        return {"insight": "Track your spending closely to reach your savings goals!"}
