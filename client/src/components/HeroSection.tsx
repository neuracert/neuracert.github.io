import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Shield, ArrowRight, Play } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-cyber-blue/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))_0%,transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--cyber-blue))_0%,transparent_50%)] opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Shield className="w-3 h-3 mr-1" />
            LLM Security Testing Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-cyber-blue bg-clip-text text-transparent">
              Neuracert
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Test AI model security with sophisticated prompts. Get real-time safety scores and contribute to the community-driven security database.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/test">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-cyber-blue hover:shadow-glow transition-all group px-8"
              >
                Start Security Test
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/battle">
              <Button size="lg" variant="outline" className="border-warning/30 hover:border-warning/50 text-warning hover:bg-warning hover:text-warning-foreground">
                <Shield className="mr-2 h-4 w-4" />
                Battle Arena
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary/50">
                <Play className="mr-2 h-4 w-4" />
                View Results
              </Button>
            </Link>
          </div>
          
          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="text-2xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">AI Models</div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="text-2xl font-bold text-cyber-blue mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Security Tests</div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="text-2xl font-bold text-success mb-1">Real-time</div>
              <div className="text-sm text-muted-foreground">Results</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};