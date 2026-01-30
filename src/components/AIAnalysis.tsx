import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Camera, 
  Sparkles, 
  Droplets, 
  Sun, 
  Moon, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import modelPortrait from "@/assets/model-portrait.jpg";
import SkinAnalysisModal from "@/components/SkinAnalysisModal";

const skinTypes = [
  { id: "dry", label: "Dry", icon: Sun },
  { id: "oily", label: "Oily", icon: Droplets },
  { id: "combination", label: "Combination", icon: Moon },
  { id: "sensitive", label: "Sensitive", icon: Sparkles },
];

const AIAnalysis = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="ai-analysis" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div>
              <span className="inline-flex items-center gap-2 text-primary font-medium mb-4">
                <Sparkles className="w-5 h-5" />
                AI-Powered Analysis
              </span>
              
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Your Personal{" "}
                <span className="text-primary">Skin Expert</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Our advanced AI technology analyzes your skin in seconds, 
                identifying concerns and creating a personalized routine 
                just for you.
              </p>

              {/* Skin Type Selection */}
              <div className="mb-8">
                <p className="font-medium text-foreground mb-4">Select your skin type:</p>
                <div className="grid grid-cols-2 gap-4">
                  {skinTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                        selectedType === type.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <type.icon className="w-5 h-5" />
                      <span className="font-medium">{type.label}</span>
                      {selectedType === type.id && (
                        <CheckCircle2 className="w-5 h-5 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  "Advanced facial recognition technology",
                  "Analyzes 50+ skin parameters",
                  "Personalized product recommendations",
                  "Track your skin's progress over time",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 group"
                onClick={() => setIsModalOpen(true)}
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Your Analysis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
                <img
                  src={modelPortrait}
                  alt="AI Skin Analysis Demo"
                  className="w-full h-auto"
                />
                
                {/* Analysis Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {/* Analysis Points */}
                <div className="absolute top-1/4 left-1/3 animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-primary border-2 border-card" />
                  <div className="absolute left-6 top-0 bg-card px-3 py-1 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                    Hydration: 85%
                  </div>
                </div>
                
                <div className="absolute top-1/2 right-1/4 animate-pulse delay-300">
                  <div className="w-4 h-4 rounded-full bg-accent-foreground border-2 border-card" />
                  <div className="absolute right-6 top-0 bg-card px-3 py-1 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                    Elasticity: 92%
                  </div>
                </div>
                
                <div className="absolute bottom-1/3 left-1/4 animate-pulse delay-500">
                  <div className="w-4 h-4 rounded-full bg-primary border-2 border-card" />
                  <div className="absolute left-6 top-0 bg-card px-3 py-1 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                    Radiance: 78%
                  </div>
                </div>
              </Card>

              {/* Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">98%</p>
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SkinAnalysisModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default AIAnalysis;
