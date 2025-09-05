import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft, Zap, Crown, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const API_PROVIDERS = [
  { 
    id: "openai", 
    name: "OpenAI", 
    endpoint: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4o-mini"
  },
  { 
    id: "gemini", 
    name: "Google Gemini", 
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    defaultModel: "gemini-2.5-flash"
  },
  { 
    id: "openrouter", 
    name: "OpenRouter", 
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    defaultModel: "meta-llama/llama-3.1-8b-instruct:free"
  }
];

const BattlePage = () => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [responses, setResponses] = useState<{[key: string]: string}>({});
  const [showVoting, setShowVoting] = useState(false);
  const [winner, setWinner] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check available models based on saved API keys
    const savedKeys = JSON.parse(localStorage.getItem('neuracert_api_keys') || '{}');
    const available = Object.keys(savedKeys).filter(provider => savedKeys[provider].key);
    setAvailableModels(available);
    
    if (available.length >= 2) {
      // Randomly select 2 models if none selected
      if (selectedModels.length === 0) {
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        setSelectedModels(shuffled.slice(0, 2));
      }
    }
  }, [selectedModels.length]);

  const callLLMAPI = async (provider: string, message: string, apiKey: string, model: string) => {
    const providerConfig = API_PROVIDERS.find(p => p.id === provider);
    if (!providerConfig) throw new Error("Provider not found");

    switch (provider) {
      case "openai":
        const openaiResponse = await fetch(providerConfig.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: message }],
            max_tokens: 1000
          })
        });
        
        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }
        
        const openaiData = await openaiResponse.json();
        return openaiData.choices[0].message.content;

      case "gemini":
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiResponse = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7
            }
          })
        });
        
        if (!geminiResponse.ok) {
          const errorData = await geminiResponse.json();
          throw new Error(`Gemini API error: ${errorData.error?.message || geminiResponse.status}`);
        }
        
        const geminiData = await geminiResponse.json();
        return geminiData.candidates[0].content.parts[0].text;

      case "openrouter":
        const openrouterResponse = await fetch(providerConfig.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "Neuracert Security Testing"
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: message }],
            max_tokens: 1000
          })
        });
        
        if (!openrouterResponse.ok) {
          throw new Error(`OpenRouter API error: ${openrouterResponse.status}`);
        }
        
        const openrouterData = await openrouterResponse.json();
        return openrouterData.choices[0].message.content;

      default:
        throw new Error("Unsupported provider");
    }
  };

  const runBattle = async () => {
    if (selectedModels.length !== 2 || !testMessage) {
      toast({
        title: "Missing Information",
        description: "Please select 2 models and enter a test message.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResponses({});
    setShowVoting(false);

    try {
      const savedKeys = JSON.parse(localStorage.getItem('neuracert_api_keys') || '{}');
      const newResponses: {[key: string]: string} = {};

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 800);

      // Test both models concurrently
      const promises = selectedModels.map(async (provider) => {
        const config = savedKeys[provider];
        const model = config.model || API_PROVIDERS.find(p => p.id === provider)?.defaultModel || "";
        const response = await callLLMAPI(provider, testMessage, config.key, model);
        newResponses[provider] = response;
      });

      await Promise.all(promises);
      clearInterval(progressInterval);
      
      setProgress(100);
      setResponses(newResponses);
      setShowVoting(true);

    } catch (error) {
      console.error('Battle error:', error);
      toast({
        title: "Battle Failed",
        description: "Failed to get responses from the models. Check your API keys.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const selectWinner = async (winnerProvider: string) => {
    setWinner(winnerProvider);
    
    try {
      // Record battle result
      const loser = selectedModels.find(m => m !== winnerProvider) || "";
      const savedKeys = JSON.parse(localStorage.getItem('neuracert_api_keys') || '{}');
      
      const winnerModel = savedKeys[winnerProvider]?.model || API_PROVIDERS.find(p => p.id === winnerProvider)?.defaultModel || "";
      const loserModel = savedKeys[loser]?.model || API_PROVIDERS.find(p => p.id === loser)?.defaultModel || "";

      // Record winner
      await supabase.from('security_test_results').insert({
        model_id: `${winnerProvider}:${winnerModel}`,
        category: 'Battle',
        prompt_category: 'Head-to-Head',
        score: 80, // Winner gets higher score
        response_evaluation: `Won battle against ${loser}:${loserModel}`,
        masked_api_key: `${winnerProvider}_battle`
      });

      // Record loser
      await supabase.from('security_test_results').insert({
        model_id: `${loser}:${loserModel}`,
        category: 'Battle',
        prompt_category: 'Head-to-Head',
        score: 40, // Loser gets lower score
        response_evaluation: `Lost battle against ${winnerProvider}:${winnerModel}`,
        masked_api_key: `${loser}_battle`
      });

      toast({
        title: "Battle Result Recorded",
        description: `${API_PROVIDERS.find(p => p.id === winnerProvider)?.name} wins!`,
      });

      // Reset for next battle
      setTimeout(() => {
        setWinner("");
        setShowVoting(false);
        setResponses({});
        setTestMessage("");
        
        // Randomly select 2 new models
        const shuffled = [...availableModels].sort(() => 0.5 - Math.random());
        setSelectedModels(shuffled.slice(0, 2));
      }, 3000);

    } catch (error) {
      console.error('Battle record error:', error);
      toast({
        title: "Recording Failed",
        description: "Failed to record battle result.",
        variant: "destructive"
      });
    }
  };

  if (availableModels.length < 2) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-warning" />
                <span className="text-xl font-bold">Battle Arena</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="p-8 text-center bg-gradient-card border-border/50">
            <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Setup Required</h2>
            <p className="text-muted-foreground mb-6">
              You need API keys for at least 2 different providers to start a battle.
              <br />
              Currently available: {availableModels.length}/2
            </p>
            <Link to="/test">
              <Button className="bg-gradient-to-r from-primary to-cyber-blue">
                Configure API Keys
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-warning" />
              <span className="text-xl font-bold">Battle Arena</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Battle Configuration */}
        <Card className="p-6 mb-8 bg-gradient-card border-border/50">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-warning" />
            Configure Battle
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="text-base font-medium mb-2 block">Challenger 1</Label>
              <Select 
                value={selectedModels[0] || ""} 
                onValueChange={(value) => setSelectedModels([value, selectedModels[1] || ""])}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select first model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {API_PROVIDERS.find(p => p.id === provider)?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block">Challenger 2</Label>
              <Select 
                value={selectedModels[1] || ""} 
                onValueChange={(value) => setSelectedModels([selectedModels[0] || "", value])}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select second model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.filter(p => p !== selectedModels[0]).map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {API_PROVIDERS.find(p => p.id === provider)?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-base font-medium mb-2 block">Battle Message</Label>
            <Textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a message to test both models..."
              className="bg-background/50 min-h-[100px]"
            />
          </div>

          <Button 
            onClick={runBattle}
            disabled={isRunning || selectedModels.length !== 2 || !testMessage}
            size="lg"
            className="bg-gradient-to-r from-warning to-destructive"
          >
            {isRunning ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Battle in Progress...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Start Battle
              </>
            )}
          </Button>
        </Card>

        {/* Progress */}
        {isRunning && (
          <Card className="p-6 mb-8 bg-gradient-card border-border/50">
            <h3 className="text-lg font-semibold mb-4">Battle in Progress</h3>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">{progress}% complete</p>
          </Card>
        )}

        {/* Battle Results */}
        {Object.keys(responses).length === 2 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {selectedModels.map((provider) => (
              <Card key={provider} className={`p-6 bg-gradient-card border-border/50 transition-all ${
                winner === provider ? 'ring-2 ring-success' : ''
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {API_PROVIDERS.find(p => p.id === provider)?.name}
                  </h3>
                  {winner === provider && <Crown className="h-6 w-6 text-warning" />}
                </div>
                
                <div className="bg-background/50 p-4 rounded border mb-4">
                  <p className="text-sm whitespace-pre-wrap">{responses[provider]}</p>
                </div>

                {showVoting && !winner && (
                  <Button 
                    onClick={() => selectWinner(provider)}
                    className="w-full bg-gradient-to-r from-primary to-cyber-blue"
                  >
                    This Response is More Secure
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {winner && (
          <Card className="p-6 text-center bg-gradient-card border-border/50">
            <Crown className="h-12 w-12 mx-auto mb-4 text-warning" />
            <h3 className="text-xl font-bold mb-2">
              {API_PROVIDERS.find(p => p.id === winner)?.name} Wins!
            </h3>
            <p className="text-muted-foreground">Starting next battle in 3 seconds...</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BattlePage;