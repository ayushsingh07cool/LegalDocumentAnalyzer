# SemanticPDF — AI Document Intelligence Platform

SemanticPDF is a full-stack AI-powered document intelligence system that enables users to upload PDFs, generate semantic embeddings, perform vector-based retrieval, and interact with documents through grounded conversational AI.

The platform uses Retrieval-Augmented Generation (RAG), semantic chunking, vector embeddings, and Pinecone similarity search to provide context-aware answers directly from uploaded documents.

---
# Demo preview
# 1.Hero Image
![Home UI] assets/home.png

# 2.ARCHITECTURE
# Architecture

![Architecture] assets/architecture.png

# 3. UPLOAD PAGE

# Upload Interface

 assets/upload.png

# 4. CHAT UI

# AI Chat Interface

 assets/chat.png

# 5. PROCESS
# Processing 

![Pipeline] assets/process.png


# 6. ANSWER EXAMPLE

# Grounded AI Responses

![Answer Example] assets/answer.png
# Features

## Current Features

### AI-Powered Document Chat

* Ask natural language questions about uploaded PDFs
* Context-aware grounded AI responses
* Retrieval-Augmented Generation (RAG) pipeline

### Semantic Search Pipeline

* Semantic text chunking
* Gemini embedding generation
* Pinecone vector database integration
* Similarity-based document retrieval

### Multi-PDF Retrieval Isolation

* Metadata-scoped retrieval
* Document-specific querying
* Prevents cross-document hallucinations

### Modern AI Frontend

* Responsive AI chat interface
* Upload progress visualization
* Source chunk display
* Clean modern UI/UX

### Backend Architecture

* Express.js API server
* Modular helper architecture
* Pinecone namespace support
* PDF parsing and extraction pipeline

---

# Tech Stack

## Frontend

* React.js
* Vite
* Axios
* Modern CSS

## Backend

* Python 3 + FastAPI + Uvicorn
* PyMuPDF for PDF text extraction
* LangChain text splitters for semantic chunking
* Google Gemini (google.genai) for embeddings / answer generation
* Pinecone as the vector database

## AI / Vector Search

* Google Gemini API
* Pinecone Vector Database
* Semantic Embeddings
* RAG Pipeline

---

# System Architecture

User Uploads PDF
↓
PDF Text Extraction
↓
Semantic Chunking
↓
Gemini Embedding Generation
↓
Pinecone Vector Storage
↓
User Question
↓
Semantic Similarity Search
↓
Context Retrieval
↓
Grounded AI Response

---

# Folder Structure

Legal Document Analyser/
├── backend/
│   ├── config/
│   │   └── constants.py        # namespace, top-k, etc.
│   ├── helpers/
│   │   ├── pdf.py               # PDF text extraction
│   │   ├── chunk.py              # semantic chunking
│   │   ├── embed.py              # Gemini embeddings
│   │   ├── pinecone.py           # Pinecone client / upsert
│   │   ├── search.py             # similarity search
│   │   ├── answer.py             # grounded answer generation
│   │   ├── gemini.py              # Gemini client
│   │   ├── prompt.py              # prompt templates
│   │   └── upload.py              # upload pipeline orchestration
│   ├── routes/
│   │   ├── upload.py             # POST /upload
│   │   └── chat.py                # POST /chat
│   ├── server.py                  # FastAPI app entrypoint
│   └── requirement.txt
│
└── frontend/
    ├── src/
    │   ├── pages/                 # HomePage, UploadPage, ChatPage
    │   ├── components/            # DropZone, AnswerCard, SourcesPanel, etc.
    │   ├── store/                  # AppStore (app state)
    │   └── lib/                    # api.ts, parseAnswer.ts, utils.ts
    └── vite.config.ts

---

# Installation Guide

## 1. Clone Repository


git clone https://github.com/ayushsingh07cool/LegalDocumentAnalyzer.git
cd "Legal Document Analyser"


---

# Backend Setup

## 2. Navigate to Backend

cd backend
python -m venv .venv

# activate the virtual environment
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # macOS / Linux

pip install -r requirement.txt


## 4. Create a backend/.env file:

Create a `.env` file inside backend folder:

GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=semanticpdf





Backend runs on:


http://localhost:5000
```



# Frontend Setup

## 6. Navigate to Frontend


cd ../frontend
npm install

## 7. Install Dependencies


npm install




## 8. Run Frontend


npm run dev


Frontend runs on:


http://localhost:5173

---

# API Endpoints

## Upload PDF

POST `/upload`

Uploads PDF, extracts text, generates embeddings, and stores vectors in Pinecone.

---

## Ask Questions

POST `/chat`

Accepts:

* question
* pdfName

Returns:

* grounded AI answer
* semantic matches
* source chunks

---

# Example Workflow

1. Upload PDF
2. Backend extracts text
3. Semantic chunks are generated
4. Embeddings stored in Pinecone
5. User asks questions
6. Relevant chunks retrieved
7. Gemini generates grounded response

---

# Upcoming Features

## Planned AI Features

* Streaming AI responses
* Conversation memory
* Citation-based answers
* Source highlighting
* PDF preview integration
* Multi-document workspace
* AI summarization
* Knowledge graph integration

## Planned Platform Features

* User authentication
* Cloud deployment
* MongoDB integration
* Conversation persistence
* Team collaboration
* Document collections

---

# Future Vision

SemanticPDF is evolving from a document chatbot into a scalable AI knowledge intelligence platform capable of semantic reasoning, contextual retrieval, and intelligent document interaction.

---

