import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBot from "@/assets/hero-bot.png";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4 animate-pulse-glow" />
              AI-Powered Interview Practice
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              Ace Your Next
              <br />
              <span className="text-primary text-glow">Interview</span> with AI
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Practice with our intelligent interview bot that adapts to your skill level, 
              provides real-time feedback, and helps you land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold text-base px-8"
                onClick={onGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div>
                <p className="text-2xl font-bold text-foreground">10K+</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">95%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
            </div>
          </div>

          {/* Right - Bot image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-75" />
              <img
                src={heroBot}
                alt="Virtual Interview Bot"
                width={500}
                height={500}
                className="relative z-10 animate-float drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
