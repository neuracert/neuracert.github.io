import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award, Shield, ArrowLeft, Filter, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaderboardEntry {
  model_id: string;
  category: string;
  avg_score: number;
  test_count: number;
  latest_test: string;
}

const LeaderboardPage = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter(entry => entry.category === selectedCategory));
    }
  }, [entries, selectedCategory]);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/neuracert/neuracert.github.io/refs/heads/main/leaderboard-data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModelDisplayName = (modelId: string) => {
    const modelNames: { [key: string]: string } = {
      "openai-gpt-4": "OpenAI GPT-4",
      "openai-gpt-3.5": "OpenAI GPT-3.5",
      "gemini-pro": "Gemini Pro",
      "claude-3": "Claude 3",
      "llama-2": "Llama 2"
    };
    return modelNames[modelId] || modelId;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{index + 1}</span>;
    }
  };

  const categories = Array.from(new Set(entries.map(entry => entry.category)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Security Leaderboard</span>
            </div>
          </div>
          <Link to="/test">
            <Button className="bg-gradient-to-r from-primary to-cyber-blue">
              Run Test
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI Security Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Rankings based on security test performance across different categories
          </p>
          
          {/* Filter */}
          <div className="flex justify-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64 bg-card/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center bg-gradient-card border-border/50">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold mb-1">{entries.length}</div>
            <div className="text-sm text-muted-foreground">Model Rankings</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-card border-border/50">
            <Shield className="h-8 w-8 text-cyber-blue mx-auto mb-2" />
            <div className="text-2xl font-bold mb-1">
              {entries.reduce((sum, entry) => sum + entry.test_count, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-card border-border/50">
            <Trophy className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold mb-1">
              {entries.length > 0 ? Math.round(entries.reduce((sum, entry) => sum + entry.avg_score, 0) / entries.length) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card className="bg-gradient-card border-border/50">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold">Rankings</h2>
          </div>
          
          <div className="divide-y divide-border/50">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading leaderboard data...
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No results found for the selected category.
              </div>
            ) : (
              filteredEntries
                .sort((a, b) => b.avg_score - a.avg_score)
                .map((entry, index) => (
                  <div key={`${entry.model_id}-${entry.category}`} className="p-6 hover:bg-background/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8">
                          {getRankIcon(index)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {getModelDisplayName(entry.model_id)}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {entry.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {entry.test_count} tests
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={getScoreBadge(entry.avg_score)}
                            className="text-sm px-3 py-1"
                          >
                            {entry.avg_score}/100
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last tested: {new Date(entry.latest_test).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Card className="p-8 bg-gradient-to-r from-card to-secondary border-border/50">
            <h3 className="text-xl font-semibold mb-4">
              Want to see your model on the leaderboard?
            </h3>
            <p className="text-muted-foreground mb-6">
              Run security tests on different AI models and contribute to the community database.
            </p>
            <Link to="/test">
              <Button size="lg" className="bg-gradient-to-r from-primary to-cyber-blue">
                Start Testing
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;