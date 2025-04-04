
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PenSquare, Trash2 } from "lucide-react";
import AdminBarberForm from "@/components/admin/AdminBarberForm";

interface Barber {
  id: string;
  name: string;
  image: string;
  location: string;
  specialty?: string;
  description?: string;
  rating?: number;
}

const AdminBarberTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Fetch barbers
  const { data: barbers, isLoading } = useQuery({
    queryKey: ['barbers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('barbers')
        .select('*');

      if (error) throw error;
      return data as Barber[];
    }
  });
  
  // Delete barber mutation
  const deleteBarberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('barbers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbers'] });
      toast({
        title: "Stylist deleted",
        description: "Stylist has been removed successfully",
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

  // Handle delete barber
  const handleDeleteBarber = (id: string) => {
    if (window.confirm("Are you sure you want to delete this stylist?")) {
      deleteBarberMutation.mutate(id);
    }
  };

  // Handle edit barber
  const handleEditBarber = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsFormOpen(true);
  };

  // Handle add new barber
  const handleAddBarber = () => {
    setSelectedBarber(null);
    setIsFormOpen(true);
  };

  // Handle form close
  const handleCloseForm = () => {
    setSelectedBarber(null);
    setIsFormOpen(false);
  };
  
  if (isFormOpen) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            {selectedBarber ? 'Edit Stylist' : 'Add New Stylist'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleCloseForm}>
            <Trash2 size={18} />
          </Button>
        </CardHeader>
        <CardContent>
          <AdminBarberForm 
            barber={selectedBarber} 
            onClose={handleCloseForm} 
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddBarber} className="gap-2">
          <Plus size={16} />
          Add Stylist
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-barber-card animate-pulse">
              <CardContent className="p-4 h-48"></CardContent>
            </Card>
          ))}
        </div>
      ) : barbers?.length === 0 ? (
        <Card className="bg-barber-card">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No stylists found. Add a new stylist to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {barbers?.map((barber) => (
            <Card key={barber.id} className="bg-barber-card overflow-hidden">
              <div className="relative h-40">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium">{barber.name}</h3>
                <p className="text-sm text-muted-foreground">{barber.location}</p>
                {barber.specialty && (
                  <p className="text-sm text-barber-accent mt-1">{barber.specialty}</p>
                )}
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-barber-accent hover:bg-barber-accent hover:text-barber-dark"
                    onClick={() => handleEditBarber(barber)}
                  >
                    <PenSquare size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeleteBarber(barber.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBarberTab;
