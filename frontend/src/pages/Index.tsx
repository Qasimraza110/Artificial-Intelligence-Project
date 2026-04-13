import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/pages/Dashboard";
import { Bot } from "lucide-react";

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
            <Bot className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Initializing InterviewBot...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setAuthOpen(true)} />
      <HeroSection onGetStarted={() => setAuthOpen(true)} />
      <FeaturesSection />
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onLogin={() => {
          setAuthOpen(false);
          setIsLoggedIn(true);
        }}
      />
    </div>
  );
};

export default Index;
