
import React from "react";
import { PenSquare, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  barber_id: string;
  is_popular: boolean;
}

interface AdminServiceGridProps {
  services: Service[];
  isLoading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const AdminServiceGrid: React.FC<AdminServiceGridProps> = ({
  services,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-barber-card animate-pulse">
            <CardContent className="p-4 h-32"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <Card className="bg-barber-card">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No services found. Add a new service to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card key={service.id} className="bg-barber-card">
          <CardContent className="p-4">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-lg font-medium">{service.name}</h3>
                <div className="flex justify-between mt-1">
                  <span className="text-barber-accent font-bold">${service.price}</span>
                  <span className="text-sm text-muted-foreground">{service.duration} min</span>
                </div>
                {service.is_popular && (
                  <span className="bg-barber-accent/20 text-barber-accent text-xs px-2 py-0.5 rounded-full inline-block mt-2">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-barber-accent hover:bg-barber-accent hover:text-barber-dark"
                  onClick={() => onEdit(service)}
                >
                  <PenSquare size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onDelete(service.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminServiceGrid;
