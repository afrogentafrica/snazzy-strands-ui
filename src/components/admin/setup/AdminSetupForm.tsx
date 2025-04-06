
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSetupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
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

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Already have an admin account?{" "}
          <Link to="/admin/login" className="text-barber-accent hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default AdminSetupForm;
