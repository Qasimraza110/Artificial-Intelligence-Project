from fastapi import APIRouter

router = APIRouter()

keywords = ["team", "project", "api", "problem", "solution"]

@router.post("/evaluate")
def evaluate(data: dict):

    answer = data["answer"].lower()
    score = 0

    for word in keywords:
        if word in answer:
            score += 10

    grade = "Excellent" if score >= 30 else "Good" if score >= 20 else "Average"

    return {
        "score": score,
        "grade": grade
    }   