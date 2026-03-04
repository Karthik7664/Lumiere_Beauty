import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Upload, 
  Loader2, 
  Sparkles, 
  Droplets, 
  Sun, 
  Heart,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/currency";

interface SkinAnalysis {
  overallScore: number;
  skinType: string;
  hydrationLevel: number;
  elasticityLevel: number;
  radianceLevel: number;
  concerns: string[];
  recommendations: string[];
  routineSuggestions: {
    morning: string[];
    evening: string[];
  };
}

interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
}

interface SkinAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecommendedProductsGrid = ({ products }: { products: RecommendedProduct[] }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({ title: "Please sign in", description: "Sign in to add recommended products to cart.", variant: "destructive" });
      return;
    }

    setProcessingId(productId);
    try {
      await addToCart(productId);
      toast({ title: "Added to cart", description: "Recommended product added successfully." });
    } finally {
      setProcessingId(null);
    }
  };

  const handleWishlistToggle = async (productId: string) => {
    if (!user) {
      toast({ title: "Please sign in", description: "Sign in to save recommended products to wishlist.", variant: "destructive" });
      return;
    }

    setProcessingId(productId);
    try {
      await toggleWishlist(productId);
      toast({ title: "Wishlist updated", description: "Recommendation saved successfully." });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-primary" />
        Recommended Products for You
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <p className="text-xs text-primary font-medium uppercase">{product.brand}</p>
              <p className="text-sm font-semibold text-foreground line-clamp-2">{product.name}</p>
              <p className="text-sm font-bold text-foreground mt-1">{formatPrice(product.price)}</p>
              <div className="flex gap-1 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={processingId === product.id}
                >
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  Add
                </Button>
                <Button
                  size="sm"
                  variant={isInWishlist(product.id) ? "default" : "ghost"}
                  className="h-7 w-7 p-0"
                  onClick={() => handleWishlistToggle(product.id)}
                  disabled={processingId === product.id}
                >
                  <Heart className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SkinAnalysisModal = ({ isOpen, onClose }: SkinAnalysisModalProps) => {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">("upload");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image under 10MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreviewImage(base64);
      await analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageBase64: string) => {
    setStep("analyzing");

    try {
      const { data, error } = await supabase.functions.invoke("analyze-skin", {
        body: { imageBase64 },
      });

      if (error) {
        throw error;
      }

      setAnalysis(data.analysis);
      setRecommendedProducts(data.recommendedProducts || []);
      setStep("results");

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      setStep("upload");
      setPreviewImage(null);
    }
  };

  const saveAnalysis = async () => {
    if (!user || !analysis) return;
    
    setSaving(true);
    try {
      const { error } = await supabase.from("skin_analyses").insert({
        user_id: user.id,
        overall_score: analysis.overallScore,
        skin_type: analysis.skinType,
        hydration_level: analysis.hydrationLevel,
        elasticity_level: analysis.elasticityLevel,
        radiance_level: analysis.radianceLevel,
        concerns: analysis.concerns,
        recommendations: analysis.recommendations,
        morning_routine: analysis.routineSuggestions.morning,
        evening_routine: analysis.routineSuggestions.evening,
        recommended_products: recommendedProducts as unknown as Record<string, unknown>,
      } as never);

      if (error) throw error;
      
      setSaved(true);
      toast({
        title: "Analysis saved!",
        description: "View your skin journey in the dashboard.",
      });
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast({
        title: "Failed to save",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetAnalysis = () => {
    setStep("upload");
    setPreviewImage(null);
    setAnalysis(null);
    setRecommendedProducts([]);
    setSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetAnalysis();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-serif">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Skin Analysis
          </DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="py-8">
            <div 
              className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Upload Your Photo
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Take a clear, well-lit selfie or upload an existing photo. 
                Our AI will analyze your skin and provide personalized recommendations.
              </p>
              
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="w-5 h-5 mr-2" />
                Choose Photo
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Sun, text: "Good lighting" },
                { icon: Camera, text: "Clear focus" },
                { icon: Heart, text: "No makeup preferred" },
              ].map((tip, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <tip.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "analyzing" && (
          <div className="py-16 text-center">
            {previewImage && (
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-8 border-4 border-primary/20">
                <img 
                  src={previewImage} 
                  alt="Your photo" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Analyzing Your Skin...
            </h3>
            <p className="text-muted-foreground">
              Our AI is examining your skin for hydration, elasticity, concerns, and more.
            </p>
          </div>
        )}

        {step === "results" && analysis && (
          <div className="py-4 space-y-8">
            {/* Overall Score */}
            <div className="flex items-center gap-6">
              {previewImage && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 flex-shrink-0">
                  <img 
                    src={previewImage} 
                    alt="Your photo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">Overall Skin Health</span>
                  <span className="text-3xl font-bold text-primary">{analysis.overallScore}%</span>
                </div>
                <Progress value={analysis.overallScore} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  Skin Type: <span className="font-medium text-foreground capitalize">{analysis.skinType}</span>
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Hydration", value: analysis.hydrationLevel, icon: Droplets },
                { label: "Elasticity", value: analysis.elasticityLevel, icon: Heart },
                { label: "Radiance", value: analysis.radianceLevel, icon: Sun },
              ].map((metric) => (
                <Card key={metric.label} className="p-4 bg-background">
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
            {analysis.concerns.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-accent-foreground" />
                  Identified Concerns
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.concerns.map((concern, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Expert Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Routine Suggestions */}
            {analysis.routineSuggestions && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-background">
                  <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-primary" />
                    Morning Routine
                  </h5>
                  <ol className="space-y-2">
                    {analysis.routineSuggestions.morning.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </Card>
                <Card className="p-4 bg-background">
                  <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Evening Routine
                  </h5>
                  <ol className="space-y-2">
                    {analysis.routineSuggestions.evening.map((step, index) => (
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
            )}

            {/* Product Recommendations */}
            {recommendedProducts.length > 0 && (
              <RecommendedProductsGrid products={recommendedProducts} />
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={resetAnalysis}
                className="flex-1"
              >
                Analyze Another Photo
              </Button>
              {user && !saved && (
                <Button
                  variant="outline"
                  onClick={saveAnalysis}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save to History
                </Button>
              )}
              {saved && (
                <Button
                  variant="outline"
                  className="flex-1 text-primary"
                  disabled
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Saved!
                </Button>
              )}
              <Button 
                onClick={handleClose}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Shop Recommended Products
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SkinAnalysisModal;
