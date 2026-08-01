from pinecone_config import index
from config.constants import NAMESPACE
from helpers.embed import create_embedding


def search_similar_chunks(question, pdf_name=None):
    if index is None:
        raise RuntimeError("Pinecone index is not configured. Set PINECONE_API_KEY and PINECONE_INDEX.")

    try:
        # Generate embedding
        embedding = create_embedding(question)

        # Query Pinecone
        query_response = index.query(
            vector=embedding,
            top_k=5,
            include_metadata=True,
            include_values=False,
            namespace=NAMESPACE,
            filter={"pdfName": {"$eq": pdf_name}} if pdf_name else None,
        )

        return query_response["matches"]

    except Exception as error:
        print("Search Error:", error)
        raise