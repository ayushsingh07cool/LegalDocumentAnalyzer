from google.genai import types

from helpers.gemini import embedding_model

EMBEDDING_MODEL_NAME = "gemini-embedding-2"


def create_embedding(text):
    try:
        client = embedding_model()
        response = client.models.embed_content(
            model=EMBEDDING_MODEL_NAME,
            contents=text,
            config=types.EmbedContentConfig(output_dimensionality=1024),
        )
        return response.embeddings[0].values

    except Exception as e:
        print(e)
        raise