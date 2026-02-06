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
