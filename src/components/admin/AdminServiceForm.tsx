
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  barber_id: string;
  is_popular: boolean;
}

interface FormValues {
  name: string;
  price: number;
  duration: number;
  barber_id: string;
  is_popular: boolean;
}

interface AdminServiceFormProps {
  service: Service | null;
  onClose: () => void;
}

const AdminServiceForm: React.FC<AdminServiceFormProps> = ({ service, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch barbers for dropdown
  const { data: barbers } = useQuery({
    queryKey: ['barbers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('barbers')
        .select('id, name');
      
      if (error) throw error;
      return data;
    }
  });

  // Initialize form with default values
  const form = useForm<FormValues>({
    defaultValues: service ? {
      name: service.name,
      price: service.price,
      duration: service.duration,
      barber_id: service.barber_id,
      is_popular: service.is_popular,
    } : {
      name: "",
      price: 0,
      duration: 30,
      barber_id: "",
      is_popular: false,
    }
  });
  
  // Create or update service mutation
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (service) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            name: values.name,
            price: values.price,
            duration: values.duration,
            barber_id: values.barber_id,
            is_popular: values.is_popular,
          })
          .eq('id', service.id);
        
        if (error) throw error;
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert({
            name: values.name,
            price: values.price,
            duration: values.duration,
            barber_id: values.barber_id,
            is_popular: values.is_popular,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: service ? "Service updated" : "Service created",
        description: service ? "Changes have been saved successfully" : "New service has been added",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Submit handler
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Haircut, Beard Trim, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="5" 
                    step="5" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="barber_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barber</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a barber" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {barbers?.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_popular"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Mark as popular service</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {service ? "Update Service" : "Create Service"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminServiceForm;
