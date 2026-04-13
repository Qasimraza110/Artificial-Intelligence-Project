import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Send, RotateCcw, CheckCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

// ── Category-based questions (keep labels for UI) ──
export interface InterviewCategory {
  id: string;
  label: string;
}

export const interviewCategories: InterviewCategory[] = [
  { id: "hr", label: "HR Interview" },
  { id: "mern", label: "MERN Stack" },
  { id: "app-dev", label: "App Development" },
  { id: "dsa", label: "DSA & Problem Solving" },
  { id: "python", label: "Python Development" },
  { id: "devops", label: "DevOps & Cloud" },
  { id: "system-design", label: "System Design" },
];

interface Question {
  text: string;
  concepts: string[];
}

const PracticeInterview = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<{ score: number; grade: string }[]>([]);
  const [finished, setFinished] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/questions", {
        method: "POST",
        body: JSON.stringify({ domain: selectedCategory }),
      });
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setStarted(true);
      } else {
        toast.error("No questions found for this category");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch questions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const username = localStorage.getItem("user_email");
      const evaluation = await apiRequest("/evaluate", {
        method: "POST",
        body: JSON.stringify({ 
          answer, 
          username, 
          domain: selectedCategory,
          question_text: questions[currentQ].text 
        }),
      });
      
      const newResults = [...results, evaluation];
      setResults(newResults);
      setAnswer("");

      if (currentQ + 1 >= questions.length) {
        // --- Save the whole session to history ---
        await apiRequest("/save-session", {
          method: "POST",
          body: JSON.stringify({
            username,
            domain: selectedCategory,
            attempts: newResults
          })
        });
        setFinished(true);
      } else {
        setCurrentQ(currentQ + 1);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Evaluation failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQ(0);
    setAnswer("");
    setResults([]);
    setFinished(false);
    setSelectedCategory("");
    setQuestions([]);
  };

  const avgScore = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length) 
    : 0;
  
  const finalGrade = avgScore >= 30 ? "Excellent" : avgScore >= 20 ? "Good" : "Average";

  const categoryLabel = interviewCategories.find((c) => c.id === selectedCategory)?.label ?? "";

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
          onClick={startInterview}
          disabled={!selectedCategory || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Questions...
            </>
          ) : (
            "Begin Interview"
          )}
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
          <span className="text-foreground font-medium">{categoryLabel}</span> — You finished the interview with an overall grade of <span className="text-primary font-bold">{finalGrade}</span> ({avgScore} points).
        </p>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-primary">Q{i + 1}: {q.text}</p>
                <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                  Score: {results[i]?.score}
                </span>
              </div>
              <p className="text-sm text-foreground line-clamp-3 italic">"{results[i]?.grade}" evaluation</p>
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
        <p className="text-foreground font-medium leading-relaxed">{questions[currentQ]?.text}</p>
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
          disabled={!answer.trim() || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {currentQ + 1 < questions.length ? "Next Question" : "Finish Interview"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PracticeInterview;
