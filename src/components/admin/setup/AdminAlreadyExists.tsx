
import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminAlreadyExists = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default AdminAlreadyExists;
