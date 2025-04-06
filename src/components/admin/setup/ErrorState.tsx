
import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  errorMessage: string;
};

const ErrorState = ({ errorMessage }: ErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-destructive text-destructive-foreground p-4 rounded-lg mb-8 text-center">
        <h2 className="font-bold mb-2">Error</h2>
        <p>{errorMessage}</p>
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
  );
};

export default ErrorState;
