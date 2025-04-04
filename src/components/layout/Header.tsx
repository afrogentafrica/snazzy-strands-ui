
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, MapPin, CalendarCheck, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Discover", href: "/discover", icon: MapPin },
    { name: "Search", href: "/search", icon: Search },
    { name: "Appointments", href: "/appointments", icon: CalendarCheck },
    { name: "Profile", href: user ? "/profile" : "/login", icon: User },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    menuItems.push({
      name: "Admin",
      href: "/admin",
      icon: User,
    });
  }

  return (
    <header className="bg-barber-dark text-white sticky top-0 z-50 border-b border-barber-card">
      <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="text-barber-accent font-bold text-xl">BarberShop</span>
        </Link>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium hover:text-barber-accent transition-colors"
            >
              {item.name}
            </Link>
          ))}
          
          {!user && (
            <Button asChild variant="outline" size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-barber-card animate-fade-in">
          <nav className="flex flex-col p-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 py-3 px-4 hover:bg-barber-dark rounded-md"
                onClick={closeMenu}
              >
                <item.icon className="h-5 w-5 text-barber-accent" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
