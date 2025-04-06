
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useAdminRegistration = () => {
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
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

  return { isFirstAdmin, isLoading, error };
};
