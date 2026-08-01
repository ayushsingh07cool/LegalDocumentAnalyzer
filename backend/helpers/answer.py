from helpers.gemini import get_chat_model
from helpers.prompt import build_prompt

CHAT_MODEL_NAME = "gemini-2.5-flash"


def generate_answer(question, chunks):
    if not chunks:
        return "I could not find relevant information in the document."

    try:
        context = "\n\n".join(
            chunk["metadata"]["text"] for chunk in chunks
        )

        prompt = build_prompt(question, context)

        client = get_chat_model()
        response = client.models.generate_content(
            model=CHAT_MODEL_NAME,
            contents=prompt,
        )

        return response.text.strip()

    except Exception as e:
        print(e)
        raise