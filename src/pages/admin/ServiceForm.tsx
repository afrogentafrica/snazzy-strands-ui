
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminServiceForm from "@/components/admin/AdminServiceForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ServiceForm = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="px-4 py-6">
        <header className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Add New Service</h1>
        </header>
        
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminServiceForm 
              onClose={() => navigate("/admin")}
              service={null}  // Explicitly pass null to be clear
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiceForm;
