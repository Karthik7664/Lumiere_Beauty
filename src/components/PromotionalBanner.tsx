import { useState, useEffect } from "react";
import { X, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  discount_text: string | null;
  cta_text: string;
  cta_link: string;
  background_color: string | null;
  is_active: boolean;
  image_url: string | null;
}

const PromotionalBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      const { data, error } = await supabase
        .from("promotional_banners")
        .select("*")
        .eq("is_active", true)
        .or("start_date.is.null,start_date.lte.now()")
        .or("end_date.is.null,end_date.gte.now()")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setBanner(data);
      }
      setLoading(false);
    };

    fetchBanner();
  }, []);

  if (loading || !banner || dismissed) return null;

  // Banner with image - full width hero style
  if (banner.image_url) {
    return (
      <div className="relative overflow-hidden">
        <div
          className="relative h-48 sm:h-64 md:h-80 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner.image_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-lg">
              {banner.discount_text && (
                <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold mb-3">
                  {banner.discount_text}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-muted-foreground mb-4">{banner.subtitle}</p>
              )}
              <Link to={banner.cta_link}>
                <Button className="gap-1 group">
                  {banner.cta_text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-4 p-1 bg-background/50 hover:bg-background/80 rounded-full transition-colors z-20"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Default text-only banner
  return (
    <div
      className="relative bg-primary text-primary-foreground"
      style={
        banner.background_color
          ? { backgroundColor: banner.background_color }
          : undefined
      }
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4 text-center">
          <Tag className="w-5 h-5 hidden sm:block" />
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-semibold">{banner.title}</span>
            
            {banner.discount_text && (
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm font-bold">
                {banner.discount_text}
              </span>
            )}
            
            {banner.subtitle && (
              <span className="text-primary-foreground/90 text-sm hidden md:block">
                {banner.subtitle}
              </span>
            )}
          </div>

          <Link to={banner.cta_link}>
            <Button
              variant="secondary"
              size="sm"
              className="gap-1 group"
            >
              {banner.cta_text}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PromotionalBanner;
