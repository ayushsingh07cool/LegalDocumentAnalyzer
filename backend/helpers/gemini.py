import os
from google import genai

_client = None


def get_gen_ai():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise Exception("GEMINI_API_KEY is undefined")

        _client = genai.Client(api_key=api_key)

    return _client


def embedding_model():
    return get_gen_ai()


def get_chat_model():
    return get_gen_ai()