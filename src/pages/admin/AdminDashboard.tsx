
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import AdminServiceTab from "./tabs/AdminServiceTab";
import AdminUserTab from "./tabs/AdminUserTab";
import AdminBarberTab from "./tabs/AdminBarberTab";
import { useAuth } from "@/contexts/AuthContext";
import AccessDeniedView from "./components/AccessDeniedView";
import LoadingView from "./components/LoadingView";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/admin" } } });
    } else if (isCheckingAdmin === false && !isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, isCheckingAdmin, navigate]);

  // Check admin status when component mounts
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        setIsCheckingAdmin(false);
      }
    };
    
    checkAdmin();
  }, [user, isAdmin]);

  // If not authenticated or checking admin status, show loading state
  if (!user || isCheckingAdmin) {
    return <LoadingView />;
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return <AccessDeniedView />;
  }

  return (
    <Layout>
      <div className="px-4 py-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          
          {activeTab === "services" && (
            <Button onClick={() => navigate("/admin/service")} className="gap-2">
              <Plus size={16} />
              Add Service
            </Button>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="barbers">Stylists</TabsTrigger>
            <TabsTrigger value="users">Users & Access</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <AdminServiceTab />
          </TabsContent>

          <TabsContent value="barbers">
            <AdminBarberTab />
          </TabsContent>

          <TabsContent value="users">
            <AdminUserTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
