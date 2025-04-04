
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { Textarea } from "@/components/ui/textarea";

// Define the schema for the form
const barberFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  image: z.string().url({ message: "Please enter a valid image URL" }),
  location: z.string().min(2, { message: "Location is required" }),
  specialty: z.string().optional(),
  description: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
});

type BarberFormValues = z.infer<typeof barberFormSchema>;

interface AdminBarberFormProps {
  barber: {
    id?: string;
    name: string;
    image: string;
    location: string;
    specialty?: string;
    description?: string;
    rating?: number;
  } | null;
  onClose: () => void;
}

const AdminBarberForm: React.FC<AdminBarberFormProps> = ({ barber, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize form with existing barber data or default values
  const form = useForm<BarberFormValues>({
    resolver: zodResolver(barberFormSchema),
    defaultValues: {
      name: barber?.name || "",
      image: barber?.image || "",
      location: barber?.location || "",
      specialty: barber?.specialty || "",
      description: barber?.description || "",
      rating: barber?.rating || undefined,
    },
  });

  // Create or update barber mutation
  const barberMutation = useMutation({
    mutationFn: async (values: BarberFormValues) => {
      if (barber?.id) {
        // Update existing barber
        const { error } = await supabase
          .from("barbers")
          .update(values)
          .eq("id", barber.id);

        if (error) throw error;
        return { ...values, id: barber.id };
      } else {
        // Create new barber - FIX: Pass values as a single object, not an array
        const { data, error } = await supabase
          .from("barbers")
          .insert(values)
          .select();

        if (error) throw error;
        return data[0];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
      toast({
        title: barber?.id ? "Stylist updated" : "Stylist added",
        description: barber?.id
          ? "Stylist has been updated successfully"
          : "Stylist has been added successfully",
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

  // Form submission handler
  const onSubmit = (values: BarberFormValues) => {
    barberMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="New York, NY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty</FormLabel>
              <FormControl>
                <Input placeholder="Hair, Beard, Color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A brief description of the stylist" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (0-5)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="5" 
                  step="0.1" 
                  placeholder="4.5" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={barberMutation.isPending}
          >
            {barberMutation.isPending ? "Saving..." : barber?.id ? "Update Stylist" : "Add Stylist"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminBarberForm;
