import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, User, LogOut, BarChart3, Heart, Package, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import AuthModal from "@/components/AuthModal";
import CartDrawer from "@/components/cart/CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { isAdmin } = useAdminRole();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Shop", href: "/shop", isRoute: true },
    { name: "AI Analysis", href: "/#ai-analysis", isRoute: true },
    { name: "Support", href: "/support", isRoute: true },
    { name: "About", href: "/#about", isRoute: true },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-serif font-bold text-foreground">
                Lumière<span className="text-primary">Beauty</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                  >
                    {link.name}
                  </a>
                )
              )}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:text-primary">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      My Skin Journey
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => setIsAuthModalOpen(true)}>
                  <User className="w-5 h-5" />
                </Button>
              )}
              
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:text-primary"
                onClick={() => navigate("/wishlist")}
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>

              {/* Cart */}
              <CartDrawer />

              {user ? (
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 ml-2" onClick={() => navigate("/dashboard")}>
                  My Dashboard
                </Button>
              ) : (
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 ml-2" onClick={() => setIsAuthModalOpen(true)}>
                  Get Started
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) =>
                  link.isRoute ? (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  )
                )}
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Skin Journey
                    </Link>
                    <Link
                      to="/orders"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Wishlist ({wishlistItems.length})
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                  </>
                )}
                <div className="flex gap-4 mt-4">
                  {user ? (
                    <>
                      <Button variant="outline" className="flex-1" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                      <Button className="flex-1 bg-primary text-primary-foreground" onClick={() => navigate("/dashboard")}>
                        Dashboard
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="flex-1" onClick={() => setIsAuthModalOpen(true)}>
                        Sign In
                      </Button>
                      <Button className="flex-1 bg-primary text-primary-foreground" onClick={() => setIsAuthModalOpen(true)}>
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
