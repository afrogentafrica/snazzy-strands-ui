
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Appointment = {
  id: string;
  created_at: string;
  barber_id: string;
  barber_name: string;
  user_id: string;
  appointment_date: string;
  appointment_time: string;
  service: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
};

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", activeStatus)
          .order("appointment_date", { ascending: true });

        if (error) throw error;

        setAppointments(data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, navigate, activeStatus]);

  const handleCancel = async (id: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;

      // Remove the cancelled appointment from the current list
      setAppointments(appointments.filter(appointment => appointment.id !== id));
      
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error cancelling appointment",
        description: "There was a problem cancelling your appointment.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
          <button
            onClick={() => setActiveStatus("upcoming")}
            className={`filter-pill whitespace-nowrap ${
              activeStatus === "upcoming" ? "active" : ""
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveStatus("completed")}
            className={`filter-pill whitespace-nowrap ${
              activeStatus === "completed" ? "active" : ""
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveStatus("cancelled")}
            className={`filter-pill whitespace-nowrap ${
              activeStatus === "cancelled" ? "active" : ""
            }`}
          >
            Cancelled
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-barber-accent"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-barber-card rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold">{appointment.service}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === "upcoming" ? "bg-barber-accent/20 text-barber-accent" :
                    appointment.status === "completed" ? "bg-green-500/20 text-green-500" :
                    "bg-red-500/20 text-red-500"
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <User className="w-4 h-4" />
                  <span>{appointment.barber_name}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{appointment.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(appointment.appointment_date)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.appointment_time}</span>
                </div>

                {appointment.status === "upcoming" && (
                  <Button
                    variant="outline"
                    className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
                    onClick={() => handleCancel(appointment.id)}
                  >
                    Cancel Appointment
                    <X className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="bg-barber-card rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-lg mb-2">No appointments</h3>
            <p className="text-gray-400 text-sm">
              {activeStatus === "upcoming" 
                ? "You don't have any upcoming appointments." 
                : activeStatus === "completed"
                ? "You don't have any completed appointments."
                : "You don't have any cancelled appointments."}
            </p>
            {activeStatus === "upcoming" && (
              <Button
                className="barber-button mt-6"
                onClick={() => navigate("/")}
              >
                Book an Appointment
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
