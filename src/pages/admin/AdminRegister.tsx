
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock, UserPlus, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if this is the first admin (no admins exist)
  useEffect(() => {
    const checkFirstAdmin = async () => {
      try {
        setError(null);
        const { data, error, count } = await supabase
          .from("user_roles")
          .select("*", { count: 'exact' })
          .eq("role", "admin");

        if (error) {
          console.error("Error checking admin setup:", error);
          setError("Could not check if admin registration is available");
          toast({
            title: "Error",
            description: "Could not check if admin registration is available",
            variant: "destructive",
          });
          setIsFirstAdmin(false);
        } else {
          // The count should be directly available from the response when using count: 'exact'
          console.log("Admin count:", count);
          setIsFirstAdmin(count === 0);
        }
      } catch (error: any) {
        console.error("Error:", error);
        setError("Could not check if admin registration is available");
        setIsFirstAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstAdmin();
  }, [toast]);

  // If user is already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (!isFirstAdmin) {
      toast({
        title: "Registration closed",
        description: "Admin registration is only available for the first admin account",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the user account
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;
      
      // Create admin role for this user
      if (data?.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: data.user.id,
            role: "admin",
            is_first_admin: true
          });
          
        if (roleError) throw roleError;
      }
      
      toast({
        title: "Admin account created",
        description: "Please check your email to confirm your account",
      });
      
      navigate("/admin/login");
    } catch (error: any) {
      console.error("Error during admin registration:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout hideNav>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="animate-pulse">
            <Shield className="w-12 h-12 text-barber-accent mb-4" />
            <p>Checking admin registration availability...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout hideNav>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-destructive text-destructive-foreground p-4 rounded-lg mb-8 text-center">
            <h2 className="font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
          <Shield className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin Registration</h1>
          <p className="text-center mb-6">
            There was an error checking admin registration availability.
          </p>
          <Button onClick={() => navigate("/admin/login")} className="barber-button">
            Go to Admin Login
          </Button>
        </div>
      </Layout>
    );
  }

  if (!isFirstAdmin) {
    return (
      <Layout hideNav>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <Shield className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin Already Exists</h1>
          <p className="text-center mb-6">
            An administrator account has already been set up for this application.
          </p>
          <Button onClick={() => navigate("/admin/login")} className="barber-button">
            Go to Admin Login
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideNav>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate("/")} 
            className="p-2 rounded-full bg-barber-card"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl">Create Admin Account</h1>
          <div className="w-9"></div>
        </div>

        <div className="mt-10">
          <div className="mb-6 p-4 bg-barber-card rounded-lg border border-barber-accent">
            <div className="flex items-center gap-2">
              <Shield className="text-barber-accent w-5 h-5" />
              <h2 className="font-medium">First Admin Setup</h2>
            </div>
            <p className="text-sm mt-2 text-gray-400">
              You're creating the first administrator account for this application. This account will have full access to all admin features.
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
                  placeholder="Enter admin email"
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
                  placeholder="Create a password"
                  className="pl-10 bg-barber-card border-barber-card"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10 bg-barber-card border-barber-card"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="barber-button w-full justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Admin Account"}
              <UserPlus className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an admin account?{" "}
              <Link to="/admin/login" className="text-barber-accent hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminRegister;
