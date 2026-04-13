import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Send, RotateCcw, CheckCircle } from "lucide-react";

// ── Category-based questions (easily replaceable with backend API) ──
export interface InterviewCategory {
  id: string;
  label: string;
  questions: string[];
}

export const interviewCategories: InterviewCategory[] = [
  {
    id: "hr",
    label: "HR Interview",
    questions: [
      "Tell me about yourself.",
      "What are your strengths and weaknesses?",
      "Why should we hire you?",
      "Where do you see yourself in 5 years?",
      "Why are you leaving your current job?",
    ],
  },
  {
    id: "mern",
    label: "MERN Stack",
    questions: [
      "Explain the Virtual DOM in React.",
      "What is the difference between SQL and NoSQL databases?",
      "How does middleware work in Express.js?",
      "Explain the event loop in Node.js.",
      "What are React hooks and why are they useful?",
    ],
  },
  {
    id: "app-dev",
    label: "App Development",
    questions: [
      "What is the difference between native and cross-platform development?",
      "Explain the app lifecycle in Android/iOS.",
      "How do you handle state management in mobile apps?",
      "What are push notifications and how do they work?",
      "Describe your approach to responsive UI in mobile apps.",
    ],
  },
  {
    id: "dsa",
    label: "DSA & Problem Solving",
    questions: [
      "What is the difference between a stack and a queue?",
      "Explain time complexity and Big-O notation.",
      "How does a binary search tree work?",
      "What is dynamic programming? Give an example.",
      "Explain the difference between BFS and DFS.",
    ],
  },
  {
    id: "python",
    label: "Python Development",
    questions: [
      "What are decorators in Python?",
      "Explain the difference between list and tuple.",
      "What is the GIL in Python?",
      "How does memory management work in Python?",
      "Explain list comprehension with an example.",
    ],
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    questions: [
      "What is CI/CD and why is it important?",
      "Explain the difference between Docker and Kubernetes.",
      "What is Infrastructure as Code?",
      "How do you monitor applications in production?",
      "What is a reverse proxy and how does it work?",
    ],
  },
  {
    id: "system-design",
    label: "System Design",
    questions: [
      "How would you design a URL shortener?",
      "Explain horizontal vs vertical scaling.",
      "What is a load balancer and how does it work?",
      "How would you design a chat application?",
      "What is database sharding?",
    ],
  },
];

// ── Hook for fetching questions (swap with API call later) ──
export function getQuestionsByCategory(categoryId: string): string[] {
  const category = interviewCategories.find((c) => c.id === categoryId);
  return category?.questions ?? [];
}

// ── Example: Replace getQuestionsByCategory with API call ──
// export async function fetchQuestionsFromBackend(categoryId: string): Promise<string[]> {
//   const res = await fetch(`/api/questions?category=${categoryId}`);
//   const data = await res.json();
//   return data.questions;
// }

const PracticeInterview = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const questions = getQuestionsByCategory(selectedCategory);
  const categoryLabel = interviewCategories.find((c) => c.id === selectedCategory)?.label ?? "";

  const handleSubmit = () => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setAnswer("");
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQ(0);
    setAnswer("");
    setAnswers([]);
    setFinished(false);
    setSelectedCategory("");
  };

  if (!started) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Practice Interview</h1>
        <p className="text-muted-foreground max-w-lg">
          Choose a category and answer interview questions as you would in a real interview.
        </p>

        <div className="max-w-sm space-y-2">
          <label className="text-sm font-medium text-foreground">Select Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Choose interview type..." />
            </SelectTrigger>
            <SelectContent>
              {interviewCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold"
          onClick={() => setStarted(true)}
          disabled={!selectedCategory}
        >
          Begin Interview
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Interview Complete!</h1>
        </div>
        <p className="text-muted-foreground">
          <span className="text-foreground font-medium">{categoryLabel}</span> — You answered all {questions.length} questions.
        </p>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-2">
              <p className="text-sm font-medium text-primary">Q{i + 1}: {q}</p>
              <p className="text-sm text-foreground">{answers[i]}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleRestart}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Practice Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Practice Interview</h1>
          <p className="text-sm text-muted-foreground mt-1">{categoryLabel}</p>
        </div>
        <span className="text-sm text-muted-foreground">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <p className="text-foreground font-medium leading-relaxed">{questions[currentQ]}</p>
      </div>

      <Textarea
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="min-h-[150px] bg-secondary border-border focus:border-primary"
      />

      <div className="flex gap-3">
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold"
          onClick={handleSubmit}
          disabled={!answer.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          {currentQ + 1 < questions.length ? "Next Question" : "Finish Interview"}
        </Button>
      </div>
    </div>
  );
};

export default PracticeInterview;
