import os
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.upload import router as upload_router
from routes.chat import router as chat_router

print("SERVER FILE RUNNING")

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/chat")
app.include_router(upload_router, prefix="/upload")


@app.get("/")
async def home():
    return {"message": "SemanticPDF Backend Running"}


def get_port() -> int:
    raw_port = os.getenv("PORT", "5000")
    try:
        return int(raw_port)
    except (TypeError, ValueError):
        return 5000


PORT = get_port()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=PORT,
        reload=True,
    )