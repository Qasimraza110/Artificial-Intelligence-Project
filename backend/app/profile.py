from fastapi import APIRouter
from .db import db
from bson import ObjectId

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
        
        # Fetch history
        history_cursor = db.history.find({"username": username}).sort("timestamp", -1)
        history = await history_cursor.to_list(length=20)
        
        for item in history:
            item["_id"] = str(item["_id"])
            if item.get("timestamp"):
                item["timestamp"] = item["timestamp"].isoformat()

        profile["history"] = history
        
        # Calculate stats
        total_interviews = await db.history.count_documents({"username": username})
        profile["stats"] = {
            "total_interviews": total_interviews,
            "avg_score": 0
        }
        
        if total_interviews > 0:
            pipeline = [
                {"$match": {"username": username}},
                {"$group": {"_id": None, "avg_score": {"$avg": "$score"}}}
            ]
            cursor = db.history.aggregate(pipeline)
            stats_results = await cursor.to_list(length=1)
            if stats_results:
                profile["stats"]["avg_score"] = round(stats_results[0]["avg_score"], 1)

    return profile

@router.delete("/history/{item_id}")
async def delete_history(item_id: str):
    await db.history.delete_one({"_id": ObjectId(item_id)})
    return {"message": "Deleted successfully"}