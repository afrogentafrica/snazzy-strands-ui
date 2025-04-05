
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAdminSetup = () => {
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
        // Use a direct count query to check for admin users
        const { data, error } = await supabase
          .from("user_roles")
          .select("*", { count: 'exact', head: true })
          .eq("role", "admin");

        if (error) {
          console.error("Error checking admin setup:", error);
          // Instead of throwing the error, handle it gracefully
          toast({
            title: "Error",
            description: "Could not check if admin setup is available",
            variant: "destructive",
          });
          // Assume setup is not available to prevent potential privilege escalation
          setIsSetupAvailable(false);
          setIsLoading(false);
          return;
        }
        
        // If no admins exist, setup is available
        setIsSetupAvailable(data.count === 0);
      } catch (error) {
        console.error("Error checking admin setup:", error);
        toast({
          title: "Error",
          description: "Could not check if admin setup is available",
          variant: "destructive",
        });
        // Assume setup is not available to prevent potential privilege escalation
        setIsSetupAvailable(false);
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

  const handleSignUp = async (email: string, password: string) => {
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

  return {
    isSetupAvailable,
    isLoading,
    isSubmitting,
    handleSignUp
  };
};
