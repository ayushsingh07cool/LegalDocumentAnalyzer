from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from helpers.search import search_similar_chunks
from helpers.answer import generate_answer

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str
    pdfName: str | None = None


@router.post("/")
async def ask_question(request: QuestionRequest):
    try:
        print(request)

        question = request.question
        pdf_name = request.pdfName

        if not question:
            raise HTTPException(
                status_code=400,
                detail="Question is required"
            )

        # Retrieve relevant chunks
        matches = search_similar_chunks(question, pdf_name)

        # Generate grounded answer
        answer = generate_answer(question, matches)

        return {
            "success": True,
            "answer": answer,
            "sources": [
                {
                    "score": match["score"],
                    "text": match["metadata"]["text"],
                }
                for match in matches
            ],
        }

    except Exception as error:
        print(error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )