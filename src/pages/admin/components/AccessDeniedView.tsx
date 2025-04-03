
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AccessDeniedView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  React.useEffect(() => {
    toast({
      title: "Access Denied",
      description: "You don't have administrator privileges",
      variant: "destructive",
    });
  }, [toast]);
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-lg">You don't have administrator privileges</p>
        <Button onClick={() => navigate("/")}>Go to Homepage</Button>
      </div>
    </Layout>
  );
};

export default AccessDeniedView;
