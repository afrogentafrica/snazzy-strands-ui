
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2 } from 'lucide-react';

const MakeAdminForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      // Find user ID from email using RPC (since we can't directly query auth.users)
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_id_by_email', { email_input: email });
      
      if (userError) {
        throw userError;
      }

      if (!userData) {
        toast({
          title: "User not found",
          description: `No user with email ${email} exists in the system.`,
          variant: "destructive",
        });
        return;
      }

      // 2. Insert the admin role for this user
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData,
          role: 'admin'
        });

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
          toast({
            title: "Already an admin",
            description: "This user already has admin privileges.",
          });
        } else {
          throw insertError;
        }
        return;
      }

      // Success!
      toast({
        title: "Admin privileges granted",
        description: `User ${email} is now an administrator.`,
      });
      setSuccess(true);
      setEmail('');

    } catch (error: any) {
      console.error("Error setting admin role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set user as admin",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          User Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email of user to make admin"
          required
          className="w-full"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || !email}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : success ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Success!
          </>
        ) : (
          "Make User Admin"
        )}
      </Button>
    </form>
  );
};

export default MakeAdminForm;
