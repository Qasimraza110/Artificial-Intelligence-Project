from fastapi import APIRouter, HTTPException
from db import db
from passlib.hash import bcrypt
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# SIGNUP
@router.post("/signup")
async def signup(user: dict):

    existing = await db.users.find_one({"username": user["username"]})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user["password"] = bcrypt.hash(user["password"])

    await db.users.insert_one(user)

    return {"message": "User created"}


# LOGIN (JWT TOKEN 🔥)
@router.post("/login")
async def login(user: dict):

    db_user = await db.users.find_one({"username": user["username"]})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt.verify(user["password"], db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = jwt.encode(
        {"username": db_user["username"]},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {"access_token": token}