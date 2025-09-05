import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Shield, Play, Clock, ArrowLeft, Star, Eye, EyeOff, Settings, ChevronUp, X, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const API_PROVIDERS = [
  { 
    id: "openai", 
    name: "OpenAI", 
    endpoint: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4o-mini",
    models: [
      { id: "gpt-4o", name: "GPT-4o (Multimodal)" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" }
    ]
  },
  { 
    id: "gemini", 
    name: "Google Gemini", 
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    defaultModel: "gemini-1.5-flash",
    models: [
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Experimental)" }
    ]
  },
  { 
    id: "openrouter", 
    name: "OpenRouter", 
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    defaultModel: "meta-llama/llama-3.1-8b-instruct:free",
    models: [
      { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B (Free)" },
      { id: "deepseek/deepseek-chat-v3:free", name: "DeepSeek Chat V3 (Free)" },
      { id: "anthropic/claude-3.5-sonnet:free", name: "Claude 3.5 Sonnet (Free)" }
    ]
  }
];

const TestPage = () => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [showCustomModel, setShowCustomModel] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [configCollapsed, setConfigCollapsed] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [llmResponse, setLlmResponse] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{id: string, type: 'user' | 'assistant', content: string, rating?: number}>>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved API keys from localStorage and check if config is complete
    const savedKeys = JSON.parse(localStorage.getItem('neuracert_api_keys') || '{}');
    if (selectedProvider && savedKeys[selectedProvider]) {
      setApiKey(savedKeys[selectedProvider].key);
      const savedModel = savedKeys[selectedProvider].model || API_PROVIDERS.find(p => p.id === selectedProvider)?.defaultModel || "";
      setSelectedModel(savedModel);
      setCustomModel(savedModel);
      // Collapse config if all fields are filled
      if (savedKeys[selectedProvider].key) {
        setConfigCollapsed(true);
      }
    }
  }, [selectedProvider]);

  // Auto-collapse config when all required fields are filled
  useEffect(() => {
    if (selectedProvider && apiKey && selectedModel) {
      setConfigCollapsed(true);
    }
  }, [selectedProvider, apiKey, selectedModel]);

  const saveApiKey = () => {
    if (!selectedProvider || !apiKey) return;
    
    const savedKeys = JSON.parse(localStorage.getItem('neuracert_api_keys') || '{}');
    const modelToSave = showCustomModel ? customModel : selectedModel;
    savedKeys[selectedProvider] = {
      key: apiKey,
      model: modelToSave || API_PROVIDERS.find(p => p.id === selectedProvider)?.defaultModel
    };
    localStorage.setItem('neuracert_api_keys', JSON.stringify(savedKeys));
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved locally and securely.",
    });
  };

  const handleModelSelect = (value: string) => {
    if (value === "custom") {
      setShowCustomModel(true);
      setSelectedModel("");
    } else {
      setShowCustomModel(false);
      setSelectedModel(value);
      setCustomModel(value);
    }
  };

  const clearCustomModel = () => {
    setCustomModel("");
    setShowCustomModel(false);
    setSelectedModel(API_PROVIDERS.find(p => p.id === selectedProvider)?.defaultModel || "");
  };

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
            messages: [
              { role: "user", content: message }
            ],
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: message }] 
            }],
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
            messages: [
              { role: "user", content: message }
            ],
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

  const simulateStreaming = (text: string, onUpdate: (partial: string) => void, onComplete: () => void) => {
    let currentIndex = 0;
    const words = text.split(' ');
    
    const streamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        const partial = words.slice(0, currentIndex + 1).join(' ');
        onUpdate(partial);
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        onComplete();
      }
    }, 50 + Math.random() * 100); // Random delay between 50-150ms for realistic typing
  };

  const runTest = async () => {
    if (!selectedProvider || !apiKey || !testMessage) {
      toast({
        title: "Missing Information",
        description: "Please select a provider, enter your API key, and write a test message.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setStreamingResponse("");
    setLlmResponse("");
    setShowRating(false);
    setIsRatingSubmitted(false);

    // Add user message to chat history
    const userMessageId = crypto.randomUUID();
    setChatHistory(prev => [...prev, {
      id: userMessageId,
      type: 'user',
      content: testMessage
    }]);

    try {
      const modelToUse = showCustomModel ? customModel : selectedModel;
      const model = modelToUse || API_PROVIDERS.find(p => p.id === selectedProvider)?.defaultModel || "";
      const response = await callLLMAPI(selectedProvider, testMessage, apiKey, model);
      
      // Add assistant message to chat history and simulate streaming
      const assistantMessageId = crypto.randomUUID();
      setChatHistory(prev => [...prev, {
        id: assistantMessageId,
        type: 'assistant',
        content: ""
      }]);

      simulateStreaming(
        response,
        (partial) => {
          setStreamingResponse(partial);
          setChatHistory(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: partial }
              : msg
          ));
        },
        () => {
          setLlmResponse(response);
          setStreamingResponse("");
          setShowRating(true);
        }
      );

    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Failed",
        description: "Failed to get response from the LLM. Check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleRating = async (rating: number) => {
    setUserRating(rating);
    setIsRatingSubmitted(true);

    try {
      const maskedApiKey = `${selectedProvider}_${apiKey.slice(-4)}`;
      const modelToUse = showCustomModel ? customModel : selectedModel;
      const modelUsed = modelToUse || API_PROVIDERS.find(p => p.id === selectedProvider)?.defaultModel || "";
      
      const { error } = await supabase
        .from('security_test_results')
        .insert({
          model_id: `${selectedProvider}:${modelUsed}`,
          category: 'User Test',
          prompt_category: 'Custom',
          score: rating * 10, // Convert 1-10 to 10-100
          response_evaluation: `User rated ${rating}/10 stars`,
          masked_api_key: maskedApiKey
        });

      if (error) {
        console.error('Database error:', error);
      }

      // Update chat history with rating
      setChatHistory(prev => prev.map(msg => 
        msg.type === 'assistant' && msg.content === llmResponse 
          ? { ...msg, rating }
          : msg
      ));

      toast({
        title: "Rating Submitted",
        description: `Thank you for rating the response ${rating}/10 stars!`,
      });

      // Reset for next test after a short delay
      setTimeout(() => {
        setUserRating(0);
        setShowRating(false);
        setLlmResponse("");
        setTestMessage("");
        setIsRatingSubmitted(false);
      }, 1500);
      
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your rating. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Security Test</span>
            </div>
          </div>
          {configCollapsed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfigCollapsed(false)}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Configure</span>
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        {/* Configuration Panel - Collapsible */}
        {!configCollapsed && (
          <div className="border-b bg-card/30 p-4">
            <Card className="max-w-4xl mx-auto p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Configuration
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfigCollapsed(true)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Choose provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {API_PROVIDERS.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Model</Label>
                  <Select value={showCustomModel ? "custom" : selectedModel} onValueChange={handleModelSelect}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Choose model" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvider && API_PROVIDERS.find(p => p.id === selectedProvider)?.models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomModel && (
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="Enter custom model name"
                        className="bg-background/50 text-xs"
                      />
                      <Button variant="ghost" size="sm" onClick={clearCustomModel}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">API Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter API key"
                        className="bg-background/50 pr-8"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 p-0"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Button onClick={saveApiKey} variant="outline" size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <Shield className="h-12 w-12 text-primary mx-auto opacity-50" />
                  <h3 className="text-lg font-semibold text-muted-foreground">Ready to test LLM security</h3>
                  <p className="text-sm text-muted-foreground">Configure your settings and start a security test</p>
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card border border-border'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      {message.type === 'assistant' && message.rating && (
                        <div className="mt-2 flex items-center space-x-1 pt-2 border-t border-border/50">
                          <span className="text-xs text-muted-foreground">Rated:</span>
                          {Array.from({ length: message.rating }, (_, i) => (
                            <Star key={i} className="h-3 w-3 fill-warning text-warning" />
                          ))}
                          <span className="text-xs text-muted-foreground">({message.rating}/10)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Streaming Response - Two Box Layout */}
                {streamingResponse && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Test Message Box */}
                    <div className="p-4 rounded-lg bg-secondary/20 border-l-4 border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Send className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-semibold text-muted-foreground">Test Message</h4>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-foreground">{testMessage}</p>
                    </div>
                    
                    {/* LLM Response Box */}
                    <div className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-accent-foreground" />
                        <h4 className="text-sm font-semibold text-muted-foreground">
                          LLM Response {showCustomModel ? `(${customModel})` : `(${selectedModel})`}
                        </h4>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-foreground">{streamingResponse}</p>
                      <div className="mt-2 flex items-center">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        <span className="ml-2 text-xs text-muted-foreground">Generating response...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rating Interface */}
                {showRating && llmResponse && !isRatingSubmitted && (
                  <div className="flex justify-center">
                    <Card className="p-4 bg-gradient-card border-border/50">
                      <Label className="text-sm font-medium mb-3 block text-center">
                        Rate the security of this response (1-10 stars):
                      </Label>
                      <div className="flex gap-1 justify-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-primary/10"
                            onClick={() => handleRating(star)}
                          >
                            <Star 
                              className={`h-5 w-5 transition-colors ${
                                star <= userRating 
                                  ? "fill-warning text-warning" 
                                  : "text-muted-foreground hover:text-warning/50"
                              }`}
                            />
                          </Button>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <Textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter your message to test the LLM's security response..."
                  className="bg-background/50 min-h-[60px] resize-none border-border/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!isRunning && selectedProvider && apiKey && testMessage && !showRating) {
                        runTest();
                      }
                    }
                  }}
                />
              </div>
              <Button 
                onClick={runTest}
                disabled={isRunning || !selectedProvider || !apiKey || !testMessage || showRating}
                size="lg"
                className="bg-gradient-to-r from-primary to-cyber-blue self-end"
              >
                {isRunning ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {showRating && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Please rate the response above before sending another message
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;