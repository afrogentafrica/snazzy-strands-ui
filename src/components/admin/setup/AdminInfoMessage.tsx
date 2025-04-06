
import React from "react";
import { Shield } from "lucide-react";

const AdminInfoMessage = () => {
  return (
    <div className="mb-6 p-4 bg-barber-card rounded-lg border border-barber-accent">
      <div className="flex items-center gap-2">
        <Shield className="text-barber-accent w-5 h-5" />
        <h2 className="font-medium">First Admin Setup</h2>
      </div>
      <p className="text-sm mt-2 text-gray-400">
        You're creating the first administrator account for this application. 
        This account will have full access to all admin features.
      </p>
    </div>
  );
};

export default AdminInfoMessage;
