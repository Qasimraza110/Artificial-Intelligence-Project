import { useState } from "react";
import { Bot, LogOut, MessageSquare, BarChart3, Play, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import PracticeInterview from "@/components/PracticeInterview";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

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
                  { label: "Interviews Completed", value: "0", icon: MessageSquare },
                  { label: "Average Score", value: "—", icon: BarChart3 },
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
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">Interview History</h1>
              <p className="text-muted-foreground">Your past interviews will appear here.</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <div className="max-w-md space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">User</p>
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <p className="text-sm text-muted-foreground">Total Interviews: <span className="text-foreground font-medium">0</span></p>
                  <p className="text-sm text-muted-foreground">Joined: <span className="text-foreground font-medium">Today</span></p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
