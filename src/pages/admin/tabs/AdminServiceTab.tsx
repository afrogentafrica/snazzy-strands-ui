
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminServiceGrid from "@/components/admin/AdminServiceGrid";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminServiceForm from "@/components/admin/AdminServiceForm";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  barber_id: string;
  is_popular: boolean;
}

const AdminServiceTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Fetch services
  const { data: services, isLoading } = useQuery({
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
  
  if (isFormOpen) {
    return (
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
    );
  }
  
  return (
    <AdminServiceGrid 
      services={services || []} 
      isLoading={isLoading}
      onEdit={handleEditService}
      onDelete={handleDeleteService}
    />
  );
};

export default AdminServiceTab;
