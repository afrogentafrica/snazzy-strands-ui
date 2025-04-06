
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminRegistration } from "@/hooks/useAdminRegistration";
import AdminAlreadyExists from "@/components/admin/setup/AdminAlreadyExists";
import LoadingState from "@/components/admin/setup/LoadingState";
import ErrorState from "@/components/admin/setup/ErrorState";
import AdminSetupForm from "@/components/admin/setup/AdminSetupForm";
import AdminInfoMessage from "@/components/admin/setup/AdminInfoMessage";

const AdminRegister = () => {
  const { isFirstAdmin, isLoading, error } = useAdminRegistration();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState errorMessage={error} />;
  }

  if (!isFirstAdmin) {
    return <AdminAlreadyExists />;
  }

  return (
    <Layout hideNav>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate("/")} 
            className="p-2 rounded-full bg-barber-card"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl">Create Admin Account</h1>
          <div className="w-9"></div>
        </div>

        <div className="mt-10">
          <AdminInfoMessage />
          <AdminSetupForm />
        </div>
      </div>
    </Layout>
  );
};

export default AdminRegister;
