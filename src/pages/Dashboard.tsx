import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  ArrowLeft, 
  Droplets, 
  Sun, 
  Heart, 
  TrendingUp,
  Calendar,
  Loader2,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

interface SkinAnalysisRecord {
  id: string;
  overall_score: number;
  skin_type: string;
  hydration_level: number;
  elasticity_level: number;
  radiance_level: number;
  concerns: string[];
  recommendations: string[];
  morning_routine: string[];
  evening_routine: string[];
  created_at: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<SkinAnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SkinAnalysisRecord | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("skin_analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
      if (data && data.length > 0) {
        setSelectedAnalysis(data[0]);
      }
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const getScoreTrend = () => {
    if (analyses.length < 2) return null;
    const latest = analyses[0].overall_score;
    const previous = analyses[1].overall_score;
    return latest - previous;
  };

  const trend = getScoreTrend();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-serif font-bold">My Skin Journey</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {analyses.length === 0 ? (
          <Card className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
              No Analysis History Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Complete your first AI skin analysis to start tracking your skin health journey.
            </p>
            <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground">
              Get Your First Analysis
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Analysis History */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Analysis History
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {analyses.map((analysis) => (
                  <Card
                    key={analysis.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedAnalysis?.id === analysis.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : "bg-card"
                    }`}
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-primary">
                        {analysis.overall_score}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(analysis.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <Progress value={analysis.overall_score} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2 capitalize">
                      {analysis.skin_type} skin
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Main Content - Selected Analysis */}
            <div className="lg:col-span-2 space-y-6">
              {selectedAnalysis && (
                <>
                  {/* Score Overview */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Overall Skin Health</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedAnalysis.created_at), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      {trend !== null && (
                        <div className={`flex items-center gap-1 ${trend >= 0 ? "text-primary" : "text-destructive"}`}>
                          <TrendingUp className={`w-5 h-5 ${trend < 0 ? "rotate-180" : ""}`} />
                          <span className="font-semibold">{trend >= 0 ? "+" : ""}{trend}%</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl font-bold text-primary">
                        {selectedAnalysis.overall_score}%
                      </div>
                      <div className="flex-1">
                        <Progress value={selectedAnalysis.overall_score} className="h-4" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Skin Type: <span className="font-medium text-foreground capitalize">{selectedAnalysis.skin_type}</span>
                    </p>
                  </Card>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Hydration", value: selectedAnalysis.hydration_level, icon: Droplets },
                      { label: "Elasticity", value: selectedAnalysis.elasticity_level, icon: Heart },
                      { label: "Radiance", value: selectedAnalysis.radiance_level, icon: Sun },
                    ].map((metric) => (
                      <Card key={metric.label} className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <metric.icon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{metric.label}</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">{metric.value}%</div>
                        <Progress value={metric.value} className="h-2" />
                      </Card>
                    ))}
                  </div>

                  {/* Concerns */}
                  {selectedAnalysis.concerns.length > 0 && (
                    <Card className="p-6">
                      <h4 className="font-semibold text-foreground mb-3">Identified Concerns</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.concerns.map((concern, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                          >
                            {concern}
                          </span>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Routines */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Sun className="w-4 h-4 text-primary" />
                        Morning Routine
                      </h5>
                      <ol className="space-y-2">
                        {selectedAnalysis.morning_routine.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </Card>
                    <Card className="p-4">
                      <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Evening Routine
                      </h5>
                      <ol className="space-y-2">
                        {selectedAnalysis.evening_routine.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </Card>
                  </div>

                  {/* Recommendations */}
                  {selectedAnalysis.recommendations.length > 0 && (
                    <Card className="p-6">
                      <h4 className="font-semibold text-foreground mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {selectedAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
