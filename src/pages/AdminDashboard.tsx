
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PenSquare, Trash2, X, Plus, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminServiceForm from "@/components/admin/AdminServiceForm";
import AdminServiceGrid from "@/components/admin/AdminServiceGrid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);
  
  // Fetch services
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) throw error;
      return data as Service[];
    }
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

  return (
    <Layout>
      <div className="px-4 py-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Services Management</h1>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus size={16} />
            Add Service
          </Button>
        </header>

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
      </div>
    </Layout>
  );
};

export default AdminDashboard;
