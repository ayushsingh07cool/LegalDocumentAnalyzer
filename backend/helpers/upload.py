import os
import tempfile
from pathlib import Path

from fastapi import HTTPException, UploadFile

from config.constants import NAMESPACE
from helpers.chunk import chunk_text
from helpers.embed import create_embedding
from helpers.pdf import extract_text_from_pdf
from helpers.pinecone import get_index


async def process_pdf_upload(file: UploadFile):
    index = get_index()

    if index is None:
        raise HTTPException(
            status_code=500,
            detail="Pinecone index is not configured. Set PINECONE_API_KEY and PINECONE_INDEX.",
        )

    filename = Path(file.filename or "document.pdf").name
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name

        text = extract_text_from_pdf(temp_path)

        if not text or not text.strip():
            raise HTTPException(
                status_code=400,
                detail="The uploaded PDF does not contain extractable text.",
            )

        documents = chunk_text(text)
        vectors = []

        for chunk_index, chunk_text_content in enumerate(documents):
            chunk_text_content = chunk_text_content.strip()
            if not chunk_text_content:
                continue

            vectors.append(
                {
                    "id": f"{filename}:{chunk_index}",
                    "values": create_embedding(chunk_text_content),
                    "metadata": {
                        "text": chunk_text_content,
                        "pdfName": filename,
                        "chunkIndex": chunk_index,
                    },
                }
            )

        if not vectors:
            raise HTTPException(
                status_code=400,
                detail="The uploaded PDF did not produce any text chunks to index.",
            )

        index.upsert(vectors=vectors, namespace=NAMESPACE)

        return {
            "success": True,
            "pdfName": filename,
            "chunksUpserted": len(vectors),
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)