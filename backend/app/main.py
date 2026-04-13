from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import router as auth_router
from app.profile import router as profile_router
from app.questions import router as question_router
from app.interview import router as interview_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(question_router)
app.include_router(interview_router)

@app.on_event("startup")
async def startup_event():
    print("\n" + "="*50)
    print("➜  Backend API:   http://localhost:8000")
    print("➜  Swagger Docs:  http://localhost:8000/docs")
    print("="*50 + "\n")