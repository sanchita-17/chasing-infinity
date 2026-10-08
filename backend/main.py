from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from pypdf import PdfReader
from docx import Document

import io
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq


# --------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY was not found. Check your .env file."
    )


# --------------------------------
# CREATE GROQ CLIENT
# --------------------------------

client = Groq(
    api_key=GROQ_API_KEY
)


# --------------------------------
# CREATE FASTAPI APP
# --------------------------------

app = FastAPI()


# --------------------------------
# ALLOW FRONTEND TO COMMUNICATE
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------
# HOME
# --------------------------------

@app.get("/")
def home():

    return {
        "message": "LexiGuard backend is running"
    }


# --------------------------------
# UPLOAD CONTRACT
# --------------------------------

@app.post("/upload")
async def upload_contract(
    file: UploadFile = File(...)
):

    filename = file.filename

    # Read uploaded file
    file_data = await file.read()


    # --------------------------------
    # PDF
    # --------------------------------

    if filename.lower().endswith(".pdf"):

        pdf_file = io.BytesIO(file_data)

        reader = PdfReader(pdf_file)

        text = ""

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"


    # --------------------------------
    # DOCX
    # --------------------------------

    elif filename.lower().endswith(".docx"):

        docx_file = io.BytesIO(file_data)

        document = Document(docx_file)

        text = ""

        for paragraph in document.paragraphs:

            text += paragraph.text + "\n"


    # --------------------------------
    # UNSUPPORTED FILE
    # --------------------------------

    else:

        return {
            "success": False,
            "message": "Only PDF and DOCX files are supported."
        }


    # --------------------------------
    # CLEAN TEXT
    # --------------------------------

    text = text.strip()


    # --------------------------------
    # CHECK EMPTY DOCUMENT
    # --------------------------------

    if not text:

        return {
            "success": False,
            "message": "No text could be extracted from the document."
        }


    # --------------------------------
    # GROQ AI ANALYSIS
    # --------------------------------

    try:

        response = client.chat.completions.create(

            model="openai/gpt-oss-120b",

            messages=[

                {
                    "role": "system",

                    "content": """
You are LexiGuard, an AI contract risk analysis assistant.

Analyze the provided contract and identify potentially risky clauses.

For each important risk, provide:

1. Risk title
2. Risk level: CRITICAL, HIGH, MEDIUM, or LOW
3. Why the clause may be risky
4. The relevant clause
5. A suggested safer wording

Be clear and concise.

Do not provide definitive legal advice.
"""
                },

                {
                    "role": "user",

                    "content": f"""
Analyze this contract:

{text}
"""
                }

            ],

            temperature=0.2
        )


        # Get AI response
        analysis = response.choices[0].message.content

        print("========== GROQ ANALYSIS ==========")
        print(analysis)
        print("===================================")


    except Exception as e:

        return {
            "success": False,
            "message": f"Groq AI analysis failed: {str(e)}"
        }


    # --------------------------------
    # RETURN RESULT
    # --------------------------------

    return {

        "success": True,

        "filename": filename,

        "characters": len(text),

        "text": text,

        "analysis": analysis

    }
