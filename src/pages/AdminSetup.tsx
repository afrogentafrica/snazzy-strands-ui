
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Shield, Loader2 } from "lucide-react";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSetupAvailable, setIsSetupAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if admin setup is available (no existing admins)
  useEffect(() => {
    const checkAdminSetup = async () => {
      try {
        // Check if any admin users exist
        const { data, error } = await supabase
          .from("user_roles")
          .select("id")
          .eq("role", "admin")
          .limit(1);

        if (error) throw error;
        
        // If no admins exist, setup is available
        setIsSetupAvailable(data.length === 0);
      } catch (error) {
        console.error("Error checking admin setup:", error);
        toast({
          title: "Error",
          description: "Could not check if admin setup is available",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminSetup();
  }, [toast]);

  // If user is already logged in and setup is available, create admin role
  useEffect(() => {
    const setupAdminIfLoggedIn = async () => {
      if (user && isSetupAvailable) {
        try {
          setIsSubmitting(true);
          await createAdminRole(user.id);
          toast({
            title: "Admin account created",
            description: "Your account has been set up as an admin",
          });
          navigate("/admin");
        } catch (error) {
          console.error("Error setting up admin:", error);
          toast({
            title: "Error",
            description: "Could not set up admin account",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    setupAdminIfLoggedIn();
  }, [user, isSetupAvailable, navigate, toast]);

  const createAdminRole = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "admin",
        is_first_admin: true
      });

    if (error) throw error;
  };

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
    
    setIsSubmitting(true);
    
    try {
      // Create the user account
      await signUp(email, password);
      
      // Note: The admin role will be added once the user is logged in
      // via the useEffect hook above
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Error",
        description: "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout hideNav>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <Loader2 className="w-12 h-12 animate-spin text-barber-accent" />
          <p className="mt-4 text-lg">Checking admin setup...</p>
        </div>
      </Layout>
    );
  }

  // Show not available message if admin already exists
  if (!isSetupAvailable) {
    return (
      <Layout hideNav>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <Shield className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin Already Configured</h1>
          <p className="text-center mb-6">
            An administrator account has already been set up for this application.
          </p>
          <Button onClick={() => navigate("/login")} className="barber-button">
            Go to Login
          </Button>
        </div>
      </Layout>
    );
  }

  // Show setup form
  return (
    <Layout hideNav>
      <div className="p-6">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-barber-accent mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Admin Setup</h1>
            <p className="text-gray-500 mt-2">
              Create the first administrator account
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="bg-barber-card border-barber-card"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="bg-barber-card border-barber-card"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="bg-barber-card border-barber-card"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="barber-button w-full justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Create Admin Account
                  <UserPlus className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSetup;
