
import React from "react";
import { Shield } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAdminSetup } from "@/hooks/useAdminSetup";
import LoadingState from "@/components/admin/setup/LoadingState";
import AdminAlreadyExists from "@/components/admin/setup/AdminAlreadyExists";
import SetupForm from "@/components/admin/setup/SetupForm";

const AdminSetup = () => {
  const { isSetupAvailable, isLoading, isSubmitting, handleSignUp } = useAdminSetup();

  // Show loading state
  if (isLoading) {
    return (
      <Layout hideNav>
        <LoadingState />
      </Layout>
    );
  }

  // Show not available message if admin already exists
  if (!isSetupAvailable) {
    return (
      <Layout hideNav>
        <AdminAlreadyExists />
      </Layout>
    );
  }

  // Show setup form
  return (
    <Layout hideNav>
      <div className="p-6">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-barber-accent mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Admin Setup</h1>
            <p className="text-gray-500 mt-2">
              Create the first administrator account
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <SetupForm onSubmit={handleSignUp} isSubmitting={isSubmitting} />
        </div>
      </div>
    </Layout>
  );
};

export default AdminSetup;
