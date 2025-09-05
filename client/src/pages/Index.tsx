import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Shield, Target, TrendingUp, Users, ArrowRight, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { StatsCard } from "@/components/StatsCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-cyber-blue bg-clip-text text-transparent">
              Neuracert
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/test" className="text-foreground/70 hover:text-foreground transition-colors">
              Security Test
            </Link>
            <Link to="/leaderboard" className="text-foreground/70 hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <Link to="/test">
              <Button variant="default" className="bg-gradient-to-r from-primary to-cyber-blue">
                Start Testing
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Security First
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Comprehensive LLM Security Testing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Evaluate AI models against sophisticated security threats and prompt injection attacks
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Target}
              title="Advanced Prompt Testing"
              description="Test models with carefully crafted prompts designed to reveal security vulnerabilities and inappropriate responses."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Real-time Scoring"
              description="Get immediate security scores based on how well models reject malicious or inappropriate requests."
            />
            <FeatureCard
              icon={Users}
              title="Community Driven"
              description="Contribute to the testing database with new prompts and help improve AI security across the industry."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <StatsCard
              icon={Shield}
              value="15+"
              label="Models Tested"
              className="text-primary"
            />
            <StatsCard
              icon={Target}
              value="500+"
              label="Security Tests"
              className="text-cyber-blue"
            />
            <StatsCard
              icon={CheckCircle}
              value="98%"
              label="Accuracy Rate"
              className="text-success"
            />
            <StatsCard
              icon={Zap}
              value="<2s"
              label="Test Speed"
              className="text-warning"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-card to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Test AI Security?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the community of security researchers and developers testing LLM safety across the industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/test">
                <Button size="lg" className="bg-gradient-to-r from-primary to-cyber-blue group">
                  Start Security Test
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button size="lg" variant="outline">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Neuracert</span>
              <span className="text-muted-foreground">- LLM Security Testing Platform</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <div className="text-sm text-muted-foreground">
                Built for the AI security community
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;