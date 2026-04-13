from fastapi import APIRouter
from .db import db
from datetime import datetime
from .questions import questions

router = APIRouter()

@router.post("/evaluate")
async def evaluate(data: dict):
    answer = data.get("answer", "").lower()
    question_text = data.get("question_text", "")
    domain = data.get("domain", "general")

    score = 0
    
    # Define general professional keywords for partial credit
    general_keywords = ["understand", "process", "work", "efficient", "learn", "manage", "organize", "team", "development", "logic", "goal", "strategy", "plan", "problem", "solution"]
    
    # 1. Rules-Based Scoring: Concept Matching
    domain_questions = questions.get(domain, [])
    target_concepts = []
    
    for q in domain_questions:
        if q["text"] == question_text:
            target_concepts = q.get("concepts", [])
            break
    
    if not target_concepts:
        target_concepts = ["team", "project", "api", "problem", "solution", "technical", "experience"]

    matched_concepts = []
    for concept in target_concepts:
        if concept.lower() in answer:
            score += 15
            matched_concepts.append(concept)
    
    if len(answer) > 100:
        score += 10

    # 3. Rules-Based Scoring: Partial Credit
    if score == 0 or (score < 30 and len(matched_concepts) == 0):
        partial_score = 0
        for gk in general_keywords:
            if gk in answer:
                partial_score += 5
        score = max(score, min(partial_score, 25))
    
    if score > 100:
        score = 100

    if score >= 80:
        grade = "Excellent"
    elif score >= 50:
        grade = "Good"
    elif score >= 30:
        grade = "Average"
    else:
        grade = "Poor"

    return {
        "question": question_text,
        "answer": answer,
        "score": score,
        "grade": grade,
        "matched_concepts": matched_concepts,
        "feedback": f"Captured concepts: {', '.join(matched_concepts)}" if matched_concepts else "Try to include more technical terms relevant to the question."
    }

@router.post("/save-session")
async def save_session(data: dict):
    username = data.get("username")
    domain = data.get("domain")
    attempts = data.get("attempts", [])

    if not attempts:
        return {"message": "No attempts to save", "status": "error"}

    total_score = sum(a.get("score", 0) for a in attempts)
    avg_score = round(total_score / len(attempts), 1)

    if avg_score >= 80:
        overall_grade = "Excellent"
    elif avg_score >= 50:
        overall_grade = "Good"
    elif avg_score >= 30:
        overall_grade = "Average"
    else:
        overall_grade = "Poor"

    session_record = {
        "username": username,
        "domain": domain,
        "score": avg_score,
        "grade": overall_grade,
        "attempts": attempts,
        "timestamp": datetime.now()
    }

    if username:
        await db.history.insert_one(session_record)

    return {"message": "Interview session saved successfully", "status": "success"}