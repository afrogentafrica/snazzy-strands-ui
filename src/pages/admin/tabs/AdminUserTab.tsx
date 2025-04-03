
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import MakeAdminForm from "@/components/admin/MakeAdminForm";

const AdminUserTab = () => {
  return (
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
  );
};

export default AdminUserTab;
