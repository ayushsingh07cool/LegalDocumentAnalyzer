from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()

pinecone = None
index = None


def get_index():
    global pinecone, index

    if index is not None:
        return index

    api_key = os.getenv("PINECONE_API_KEY")
    index_name = os.getenv("PINECONE_INDEX")

    if not api_key or not index_name:
        return None

    try:
        pinecone = Pinecone(api_key=api_key)
        index = pinecone.Index(index_name)
        return index
    except Exception as error:
        print("Pinecone initialization error:", error)
        return None