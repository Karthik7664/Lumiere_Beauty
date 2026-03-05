import { Link } from "react-router-dom";
import { Sparkles, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Serums", href: "/shop?category=serums" },
    { name: "Moisturizers", href: "/shop?category=moisturizers" },
    { name: "Gift Sets", href: "/shop?category=gift-sets" },
  ],
  support: [
    { name: "Contact Us", href: "/support" },
    { name: "FAQs", href: "/support" },
    { name: "Shipping & Returns", href: "/support" },
    { name: "Track Order", href: "/orders" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://x.com", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-serif font-bold">
                Lumiere<span className="text-primary">Beauty</span>
              </span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              Revolutionizing skincare with AI technology. Personalized beauty
              routines backed by science, designed for your unique skin.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
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
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
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
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2026 Lumiere Beauty. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy-policy" className="text-background/50 hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-background/50 hover:text-background transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
