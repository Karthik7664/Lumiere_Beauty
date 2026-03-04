import { Card, CardContent } from "@/components/ui/card";
import { 
  FlaskConical, 
  Leaf, 
  Sparkles, 
  ShieldCheck, 
  Recycle, 
  Heart 
} from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "Science-First",
    description: "Every ingredient backed by clinical research and proven efficacy studies.",
  },
  {
    icon: Sparkles,
    title: "AI-Personalized",
    description: "Unique formulations tailored to your skin's specific needs and goals.",
  },
  {
    icon: Leaf,
    title: "Clean Beauty",
    description: "No parabens, sulfates, or harmful chemicals. Just pure, effective ingredients.",
  },
  {
    icon: ShieldCheck,
    title: "Dermatologist Tested",
    description: "All products tested and approved by board-certified dermatologists.",
  },
  {
    icon: Recycle,
    title: "Sustainable",
    description: "Eco-friendly packaging and cruelty-free practices for a better planet.",
  },
  {
    icon: Heart,
    title: "Results Guaranteed",
    description: "See visible results in 30 days or get your money back. We promise.",
  },
];

const Features = () => {
  return (
    <section id="ingredients" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium mb-4 block">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            The <span className="text-primary">Lumiere</span> Difference
          </h2>
          <p className="text-lg text-muted-foreground">
            We combine cutting-edge technology with nature's finest ingredients 
            to deliver skincare that truly works.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-background border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
