from fastapi import APIRouter
from db import db

router = APIRouter()

@router.post("/profile")
async def create_profile(profile: dict):
    await db.profiles.insert_one(profile)
    return {"message": "Profile created"}

@router.get("/profile/{username}")
async def get_profile(username: str):
    profile = await db.profiles.find_one({"username": username})

    if profile:
        profile["_id"] = str(profile["_id"])

    return profile