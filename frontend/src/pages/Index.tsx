import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
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
