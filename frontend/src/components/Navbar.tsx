import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  return (
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

        {/* <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
        </div> */}

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={onLoginClick}>
            Log In
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary" onClick={onLoginClick}>
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
