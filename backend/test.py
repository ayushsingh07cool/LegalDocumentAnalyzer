from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()

pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pinecone.Index(os.getenv("PINECONE_INDEX"))

fake_embedding = [0.01] * 3072

try:
    index.upsert(
        vectors=[
            {
                "id": "test-1",
                "values": fake_embedding,
                "metadata": {
                    "text": "hello world"
                }
            }
        ]
    )

    print("SUCCESS - check Pinecone dashboard!")

except Exception as e:
    print("ERROR:", str(e))