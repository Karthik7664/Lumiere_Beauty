import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SkinAnalysisModal from "@/components/SkinAnalysisModal";

const FloatingAIButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3" style={{ zIndex: 9999 }}>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-background border-border"
          asChild
        >
          <Link to="/support" aria-label="AI Shopping Assistant">
            <MessageCircle className="w-5 h-5" />
          </Link>
        </Button>

        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 p-0"
          aria-label="AI Skin Analysis"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </div>

      <SkinAnalysisModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FloatingAIButton;
