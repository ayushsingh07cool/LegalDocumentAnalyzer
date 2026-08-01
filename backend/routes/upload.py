from fastapi import APIRouter, File, UploadFile

from helpers.upload import process_pdf_upload

router = APIRouter()


@router.post("/")
async def upload_document(file: UploadFile = File(...)):
    return await process_pdf_upload(file)