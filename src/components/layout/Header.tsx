
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-barber-card animate-fade-in">
          <nav className="flex flex-col p-4">
            <Link
              to="/"
              className="flex items-center gap-3 py-3 px-4 hover:bg-barber-dark rounded-md"
              onClick={closeMenu}
            >
              <span>Home</span>
            </Link>
            <Link
              to="/discover"
              className="flex items-center gap-3 py-3 px-4 hover:bg-barber-dark rounded-md"
              onClick={closeMenu}
            >
              <span>Discover</span>
            </Link>
            <Link
              to="/search"
              className="flex items-center gap-3 py-3 px-4 hover:bg-barber-dark rounded-md"
              onClick={closeMenu}
            >
              <span>Search</span>
            </Link>
            <Link
              to={user ? "/appointments" : "/login"}
              className="flex items-center gap-3 py-3 px-4 hover:bg-barber-dark rounded-md"
              onClick={closeMenu}
            >
              <span>Appointments</span>
            </Link>
            <Link
              to={user ? "/profile" : "/login"}
              className="flex items-center gap-3 py-3 px-4 hover:bg-barber-dark rounded-md"
              onClick={closeMenu}
            >
              <span>Profile</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 py-3 px-4 hover:bg-barber-dark rounded-md"
                onClick={closeMenu}
              >
                <span>Admin</span>
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                className="flex items-center gap-3 py-3 px-4 mt-2 bg-barber-accent text-barber-dark rounded-md"
                onClick={closeMenu}
              >
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
