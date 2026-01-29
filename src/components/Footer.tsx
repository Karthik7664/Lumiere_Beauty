import { Sparkles, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "All Products", href: "#" },
    { name: "Serums", href: "#" },
    { name: "Moisturizers", href: "#" },
    { name: "Cleansers", href: "#" },
    { name: "Gift Sets", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Our Story", href: "#" },
    { name: "Ingredients", href: "#" },
    { name: "Sustainability", href: "#" },
    { name: "Careers", href: "#" },
  ],
  support: [
    { name: "Contact Us", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
    { name: "Track Order", href: "#" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer id="about" className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-serif font-bold">
                Glow<span className="text-primary">AI</span>
              </span>
            </a>
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              Revolutionizing skincare with AI technology. Personalized beauty 
              routines backed by science, designed for your unique skin.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2026 GlowAI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-background/50 hover:text-background transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-background/50 hover:text-background transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-background/50 hover:text-background transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
