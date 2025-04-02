
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  onLogout: () => Promise<void>;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <Button 
      onClick={onLogout} 
      variant="outline" 
      className="w-full mt-6 bg-transparent border-barber-card text-white hover:bg-barber-card"
    >
      Sign Out
      <LogOut className="w-5 h-5 ml-2" />
    </Button>
  );
};

export default LogoutButton;
