import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AIAnalysis from "@/components/AIAnalysis";
import Products from "@/components/Products";
import Features from "@/components/Features";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AIAnalysis />
      <Products />
      <Features />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
