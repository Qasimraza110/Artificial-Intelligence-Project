import { useState, useEffect } from "react";
import { Bot, LogOut, MessageSquare, BarChart3, Play, User, Trash2, Calendar, Target, Award, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PracticeInterview from "@/components/PracticeInterview";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardProps {
  onLogout: () => void;
}

interface UserProfile {
  username: string;
  name?: string;
  bio?: string;
  stats?: {
    total_interviews: number;
    avg_score: number;
  };
  history?: Array<{
    _id: string;
    domain: string;
    score: number;
    grade: string;
    attempts: Array<{
      question: string;
      answer: string;
      score: number;
      grade: string;
      matched_concepts: string[];
    }>;
    timestamp: string;
  }>;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("user_email");
      if (!email) return;
      
      try {
        const data = await apiRequest(`/profile/${email}`);
        setProfile(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const email = localStorage.getItem("user_email");
    if (!email) return;
    
    try {
      setLoading(true);
      const data = await apiRequest(`/profile/${email}`);
      setProfile(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening modal
    
    try {
      await apiRequest(`/history/${id}`, { method: "DELETE" });
      toast.success("History item deleted");
      fetchProfile(); // Refresh data
    } catch (error) {
      toast.error("Failed to delete history item");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "practice", label: "Practice Interview", icon: Play },
    { id: "history", label: "History", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow-primary">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">
              InterviewBot<span className="text-primary">.ai</span>
            </span>
          </div>
          <Button variant="ghost" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-border/50 bg-card/50 p-4 hidden md:block">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-64 p-6 md:p-8 mt-0 md:mt-0">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-foreground">Welcome Back! 👋</h1>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Interviews Completed", value: profile?.stats?.total_interviews?.toString() || "0", icon: MessageSquare },
                  { label: "Average Score", value: profile?.stats?.avg_score?.toString() || "—", icon: BarChart3 },
                  { label: "Practice Streak", value: "0 days", icon: Play },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold"
                onClick={() => setActiveTab("practice")}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Practice Interview
              </Button>
            </div>
          )}

          {activeTab === "practice" && <PracticeInterview />}

          {activeTab === "history" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Interview History</h1>
              {!profile?.history || profile.history.length === 0 ? (
                <p className="text-muted-foreground">Your past interviews will appear here.</p>
              ) : (
                <div className="grid gap-4">
                  {profile.history.map((item) => (
                    <Dialog key={item._id}>
                      <DialogTrigger asChild>
                        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20">
                              <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground capitalize">{item.domain.replace("-", " ")}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">{item.score}</p>
                              <p className="text-xs font-medium text-muted-foreground">{item.grade}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => handleDeleteHistory(e, item._id)}
                              className="text-muted-foreground hover:text-destructive h-8 w-8 z-10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl bg-background border-border max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Bot className="h-6 w-6 text-primary" />
                            Interview Details
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 pt-4">
                          {/* Top Stats Section */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="rounded-lg bg-secondary/30 p-4 border border-border">
                              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Target className="h-3 w-3" /> Score
                              </div>
                              <p className="text-2xl font-bold text-primary">{item.score}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/30 p-4 border border-border">
                              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Award className="h-3 w-3" /> Grade
                              </div>
                              <p className="text-2xl font-bold text-foreground">{item.grade}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/30 p-4 border border-border">
                              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Calendar className="h-3 w-3" /> Date
                              </div>
                              <p className="text-sm font-semibold truncate">
                                {new Date(item.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Attempts Section */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                              <BrainCircuit className="h-4 w-4" /> Interview Questions & Evaluation
                            </h4>
                            <div className="space-y-6">
                              {item.attempts && item.attempts.map((attempt, idx) => (
                                <div key={idx} className="rounded-xl border border-border bg-secondary/20 p-5 space-y-4">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                      <p className="text-xs font-bold text-primary uppercase tracking-wider">Question {idx + 1}</p>
                                      <p className="text-foreground font-medium">{attempt.question}</p>
                                    </div>
                                    <Badge variant="outline" className="text-primary border-primary/30">
                                      Score: {attempt.score}
                                    </Badge>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Your Answer</p>
                                    <p className="text-sm text-foreground italic">"{attempt.answer}"</p>
                                  </div>

                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {attempt.matched_concepts && attempt.matched_concepts.length > 0 ? (
                                      attempt.matched_concepts.map((concept, cIdx) => (
                                        <Badge key={cIdx} variant="secondary" className="text-[10px] py-0 h-5">
                                          {concept}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-muted-foreground italic">No technical keywords captured</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              {loading ? (
                <div className="max-w-md space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              ) : profile ? (
                <div className="max-w-md space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{profile.name || "User"}</p>
                      <p className="text-sm text-muted-foreground">{profile.username}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="text-sm font-medium text-foreground">{profile.username}</p>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="text-sm font-medium text-foreground">Computer Science</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="text-sm font-medium text-foreground">Today</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-md p-6 rounded-xl border border-dashed border-border bg-card/50 text-center">
                  <p className="text-muted-foreground">No profile data found.</p>
                  <Button variant="link" onClick={() => setActiveTab("practice")} className="mt-2">
                    Complete your first interview
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
