from fastapi import APIRouter

router = APIRouter()

# Structured questions with key concepts for rules-based evaluation
questions = {
    "mern": [
        {"text": "Explain the Virtual DOM in React.", "concepts": ["reconciliation", "diffing", "lightweight", "copy", "performance", "real dom"]},
        {"text": "What is the difference between SQL and NoSQL?", "concepts": ["structured", "schema", "relational", "scaling", "document", "flexible"]},
        {"text": "Explain the event loop in Node.js.", "concepts": ["single-threaded", "non-blocking", "callback", "stack", "queue", "libuv"]}
    ],
    "devops": [
        {"text": "What is CI/CD?", "concepts": ["continuous integration", "deployment", "pipeline", "automation", "testing"]},
        {"text": "Explain Docker vs Kubernetes.", "concepts": ["container", "orchestration", "pods", "scaling", "deployment", "image"]},
        {"text": "What is Infrastructure as Code?", "concepts": ["automation", "terraform", "ansible", "version control", "reproducible"]}
    ],
    "hr": [
        {"text": "Tell me about yourself.", "concepts": ["experience", "background", "education", "passion", "career", "skills"]},
        {"text": "Why should we hire you?", "concepts": ["fit", "value", "contribution", "goals", "solve", "problem"]},
        {"text": "What are your strengths and weaknesses?", "concepts": ["self-aware", "improvement", "discipline", "learning", "growth"]}
    ],
    "python": [
        {"text": "What are decorators?", "concepts": ["function", "wrapper", "metadata", "reusable", "syntactic sugar"]},
        {"text": "Explain list comprehension.", "concepts": ["concise", "shorten", "loop", "mapping", "filtering"]},
        {"text": "What is the difference between list and tuple?", "concepts": ["mutable", "immutable", "ordered", "performance", "parentheses"]}
    ],
    # Fallback for other domains to avoid crashes
    "general": [
        {"text": "Tell me about your most challenging project.", "concepts": ["problem", "solution", "technical", "team", "learned"]},
        {"text": "How do you handle deadlines?", "concepts": ["priority", "organization", "pressure", "communication", "time"]}
    ]
}

@router.post("/questions")
def get_questions(data: dict):
    domain_questions = questions.get(data.get("domain", "general"), questions["general"])
    return {
        "questions": domain_questions
    }
