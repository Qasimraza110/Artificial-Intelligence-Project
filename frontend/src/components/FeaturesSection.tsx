import { Brain, MessageSquare, BarChart3, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description: "Dynamic questions tailored to your role, experience level, and industry.",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Feedback",
    description: "Get instant analysis of your answers with actionable improvement tips.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress over time with detailed performance dashboards.",
  },
  {
    icon: Shield,
    title: "Industry Specific",
    description: "Specialized question banks for tech, finance, healthcare, and more.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "No waiting — get your score and feedback the moment you finish.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI interview bot combines cutting-edge technology with proven interview methodologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:glow-primary"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
