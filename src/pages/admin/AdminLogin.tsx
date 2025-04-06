
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Mail, Lock, LogIn, Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in and is admin, redirect to admin dashboard
  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin");
    } else if (user && !isAdmin) {
      // If user is logged in but not admin, redirect to home
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // The redirect will be handled by the useEffect above
    } catch (error) {
      console.error("Error during admin sign in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideNav>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate("/")} 
            className="p-2 rounded-full bg-barber-card"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl">Admin Sign In</h1>
          <div className="w-9"></div> {/* Empty div for flex spacing */}
        </div>

        <div className="mt-10">
          <div className="mb-6 p-4 bg-barber-card rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="text-barber-accent w-5 h-5" />
              <h2 className="font-medium">Admin Access Only</h2>
            </div>
            <p className="text-sm mt-2 text-gray-400">
              This area is restricted to administrators only. If you're not an admin, please return to the main site.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  className="pl-10 bg-barber-card border-barber-card"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 bg-barber-card border-barber-card"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="barber-button w-full justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Admin Sign In"}
              <LogIn className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Need admin access?{" "}
              <Link to="/admin/register" className="text-barber-accent hover:underline">
                Register as Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
