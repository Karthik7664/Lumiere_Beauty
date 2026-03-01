import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already subscribed!", description: "This email is already on our list.", variant: "default" });
        } else {
          throw error;
        }
      }
      setIsSubscribed(true);
      setEmail("");
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Get Your Glow with Lumière
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Subscribe for exclusive skincare tips, early access to new products, 
            and 15% off your first order.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 text-primary-foreground">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-lg font-medium">
                Welcome to the glow family! Check your inbox.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0 rounded-full px-6"
                required
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          )}

          <p className="text-sm text-primary-foreground/60 mt-6">
            Join 50,000+ skincare enthusiasts at Lumière Beauty. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
