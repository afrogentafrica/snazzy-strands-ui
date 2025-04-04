
import React from "react";
import { Home, MapPin, CalendarCheck, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
  hideNav?: boolean;
};

const Layout = ({ children, hideNav = false }: LayoutProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-barber-dark text-white relative">
      <Header />
      <div className="pb-20">{children}</div>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-barber-card px-6 py-3 flex justify-between items-center rounded-t-3xl border-t border-barber-dark z-50">
          <NavItem icon={<Home className="w-5 h-5" />} isActive={isActive("/")} href="/" />
          <NavItem icon={<MapPin className="w-5 h-5" />} isActive={isActive("/discover")} href="/discover" />
          <NavItem
            icon={
              <div className="w-10 h-10 rounded-full bg-barber-accent flex items-center justify-center">
                <Search className="w-5 h-5 text-barber-dark" />
              </div>
            }
            isActive={false}
            href="/search"
            className="mb-4"
          />
          <NavItem 
            icon={<CalendarCheck className="w-5 h-5" />} 
            isActive={isActive("/appointments")} 
            href={user ? "/appointments" : "/login"} 
          />
          <NavItem 
            icon={<User className="w-5 h-5" />} 
            isActive={isActive("/profile")} 
            href={user ? "/profile" : "/login"} 
          />
        </nav>
      )}
    </div>
  );
};

type NavItemProps = {
  icon: React.ReactNode;
  isActive: boolean;
  href: string;
  className?: string;
};

const NavItem = ({ icon, isActive, href, className }: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
      isActive ? "text-barber-accent" : "text-gray-500 hover:text-gray-300",
      className
    )}
  >
    {icon}
  </Link>
);

export default Layout;
