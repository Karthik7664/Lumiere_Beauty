import Navbar from "@/components/Navbar";
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
      <Navbar />
      <Hero />
      <FeaturedCarousel />
      <AIAnalysis />
      <ProductGrid />
      <Features />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
