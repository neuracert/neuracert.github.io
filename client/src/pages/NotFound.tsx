import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-cyber-blue bg-clip-text text-transparent">
              Neuracert
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 flex-grow">
        <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
            <h1 className="text-6xl font-bold text-destructive mb-4">404</h1>
            <p className="text-2xl text-muted-foreground mb-8">
              Oops! The page you're looking for doesn't exist.
            </p>
            <Link to="/">
              <Button size="lg" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

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

export default NotFound;
