
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PenSquare, Trash2, X, Plus, ShieldAlert, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AdminServiceForm from "@/components/admin/AdminServiceForm";
import AdminServiceGrid from "@/components/admin/AdminServiceGrid";
import MakeAdminForm from "@/components/admin/MakeAdminForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  barber_id: string;
  is_popular: boolean;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/admin" } } });
    } else if (isCheckingAdmin === false && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have administrator privileges",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isAdmin, isCheckingAdmin, navigate, toast]);

  // Check admin status when component mounts
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        setIsCheckingAdmin(false);
      }
    };
    
    checkAdmin();
  }, [user, isAdmin]);
  
  // Fetch services
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) throw error;
      return data as Service[];
    },
    enabled: !!user && isAdmin // Only fetch if user is authenticated and admin
  });
  
  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Service deleted",
        description: "Service has been removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle delete service
  const handleDeleteService = (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(id);
    }
  };

  // Handle edit service
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  // Handle form close
  const handleCloseForm = () => {
    setSelectedService(null);
    setIsFormOpen(false);
  };

  // Handle add new service
  const handleAddNew = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  // If not authenticated or checking admin status, show loading state
  if (!user || isCheckingAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg">Loading...</p>
        </div>
      </Layout>
    );
  }

  // If not admin, show access denied (this shouldn't normally be seen due to the redirect)
  if (!isAdmin) {
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
  }

  return (
    <Layout>
      <div className="px-4 py-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          
          {activeTab === "services" && !isFormOpen && (
            <Button onClick={handleAddNew} className="gap-2">
              <Plus size={16} />
              Add Service
            </Button>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="users">Users & Access</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            {isFormOpen ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>
                    {selectedService ? 'Edit Service' : 'Add New Service'}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={handleCloseForm}>
                    <X size={18} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <AdminServiceForm 
                    service={selectedService} 
                    onClose={handleCloseForm} 
                  />
                </CardContent>
              </Card>
            ) : (
              <AdminServiceGrid 
                services={services || []} 
                isLoading={isLoading}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
              />
            )}
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Create Admin User</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Grant administrator privileges to an existing user by entering their email below.
                  </p>
                  <MakeAdminForm />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
