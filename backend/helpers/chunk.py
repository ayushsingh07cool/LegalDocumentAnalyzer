def chunk_text(text):
    if not text:
        return []

    chunk_size = 1000
    chunk_overlap = 200
    step = max(1, chunk_size - chunk_overlap)

    chunks = []
    start = 0

    while start < len(text):
        end = min(len(text), start + chunk_size)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(text):
            break
        start += step

    return chunks