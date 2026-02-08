import Navbar from "@/components/Navbar";
import PromotionalBanner from "@/components/PromotionalBanner";
import Hero from "@/components/Hero";
import AIAnalysis from "@/components/AIAnalysis";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ProductGrid from "@/components/products/ProductGrid";
import Features from "@/components/Features";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PromotionalBanner />
      <Navbar />
      <Hero />
      <FeaturedCarousel />
      <div id="ai-analysis">
        <AIAnalysis />
      </div>
      <ProductGrid />
      <Features />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
