import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 bg-gradient-card border-border/50">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Data Collection and Storage</h2>
              <p className="mb-3">
                Neuracert is committed to protecting your privacy. We want to be completely transparent about what data we collect and how we use it.
              </p>
              <p>
                <strong>We DO NOT collect or store:</strong>
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Your API keys (stored only in your browser's local storage)</li>
                <li>Your test prompts or messages</li>
                <li>LLM responses or outputs</li>
                <li>Any personally identifiable information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">What We Do Collect</h2>
              <p className="mb-3">
                The only data we collect is minimal and anonymized for platform functionality:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Masked API Keys:</strong> Only the last 4 characters of your API key for verification purposes</li>
                <li><strong>Test Scores:</strong> Your security ratings (1-10 stars) for statistical analysis</li>
                <li><strong>Model Information:</strong> The AI model tested (e.g., "openai:gpt-3.5-turbo")</li>
                <li><strong>Timestamps:</strong> When tests were conducted for data management</li>
                <li><strong>Test Categories:</strong> General category of test (e.g., "User Test", "Battle")</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Local Storage</h2>
              <p>
                Your API keys are stored exclusively in your browser's local storage and never transmitted to our servers. 
                This means:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Only you have access to your API keys</li>
                <li>Keys are stored locally on your device</li>
                <li>We cannot access or recover your API keys</li>
                <li>Clearing your browser data will remove all stored keys</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Data Retention</h2>
              <p>
                To maintain platform performance and manage storage costs:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Test result data is periodically cleared from our database</li>
                <li>Only aggregated statistics are retained for leaderboard generation</li>
                <li>No individual test data is permanently stored</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Third-Party Services</h2>
              <p className="mb-3">
                When you use Neuracert, your prompts are sent directly from your browser to the AI provider's API (OpenAI, Google, OpenRouter, etc.) using your own API keys. We are not involved in this communication.
              </p>
              <p>
                Please review the privacy policies of your chosen AI providers:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><a href="https://openai.com/privacy/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">OpenAI Privacy Policy</a></li>
                <li><a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
                <li><a href="https://openrouter.ai/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">OpenRouter Privacy Policy</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Open Source and Transparency</h2>
              <p>
                Neuracert is committed to transparency. Our source code is available for review, and our data handling practices are designed to minimize privacy risks while providing valuable security insights for the AI community.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Contact</h2>
              <p>
                If you have any questions about this privacy policy or our data practices, please feel free to reach out through our GitHub repository or community channels.
              </p>
            </section>

            <section className="mt-8 pt-6 border-t border-border">
              <p className="text-sm">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm mt-2">
                This privacy policy may be updated from time to time. We encourage you to review it periodically.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;