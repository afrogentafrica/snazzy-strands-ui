
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Import new components
import BookingHeader from "@/components/booking/BookingHeader";
import ServiceSelector from "@/components/booking/ServiceSelector";
import BookingSlots from "@/components/booking/BookingSlots";
import BookingButton from "@/components/booking/BookingButton";
import LoadingState from "@/components/booking/LoadingState";
import NotFoundState from "@/components/booking/NotFoundState";

type Barber = {
  id: string;
  name: string;
  image: string;
  location: string;
  services?: Service[];
};

type Service = {
  id: string;
  name: string;
  price: string;
  duration: number;
};

const AVAILABLE_DATES = [
  { day: 12, month: "MAY", weekday: "SUN", date: "2023-05-12" },
  { day: 13, month: "MAY", weekday: "FRI", date: "2023-05-13" },
  { day: 14, month: "MAY", weekday: "SAT", date: "2023-05-14" },
  { day: 15, month: "MAY", weekday: "MON", date: "2023-05-15" },
  { day: 16, month: "MAY", weekday: "TUE", date: "2023-05-16" },
];

const AVAILABLE_TIMES = [
  "09:00 AM", 
  "10:00 AM", 
  "11:00 AM", 
  "01:00 PM",
  "03:00 PM", 
  "05:00 PM"
];

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[1].date);
  const [selectedTime, setSelectedTime] = useState(AVAILABLE_TIMES[4]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBarber = async () => {
      setIsLoading(true);
      
      try {
        // Fetch barber details
        const { data: barberData, error: barberError } = await supabase
          .from("barbers")
          .select("*")
          .eq("id", id)
          .single();

        if (barberError) throw barberError;

        // Fetch barber services
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("barber_id", id);

        if (servicesError) throw servicesError;

        const barberWithServices = {
          ...barberData,
          services: servicesData || []
        };

        setBarber(barberWithServices);
        
        // Select first service by default if available
        if (servicesData && servicesData.length > 0) {
          setSelectedService(servicesData[0]);
        }
      } catch (error) {
        console.error("Error fetching barber:", error);
        toast({
          title: "Error",
          description: "Could not load barber information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarber();
  }, [id, toast]);

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!barber || !selectedService) {
      toast({
        title: "Error",
        description: "Please select a service",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("appointments").insert({
        user_id: user.id,
        barber_id: barber.id,
        barber_name: barber.name,
        service: selectedService.name,
        price: selectedService.price,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        location: barber.location,
        status: "upcoming"
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your appointment has been booked.",
      });
      
      navigate("/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description: "Could not book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!barber) {
    return <NotFoundState />;
  }

  return (
    <Layout hideNav>
      <div className="p-6">
        <BookingHeader barber={barber} />
        
        <ServiceSelector
          services={barber.services}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />
        
        <BookingSlots
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          availableDates={AVAILABLE_DATES}
          availableTimes={AVAILABLE_TIMES}
        />
        
        <BookingButton
          onBooking={handleBooking}
          isSubmitting={isSubmitting}
          isDisabled={!selectedService}
        />
      </div>
    </Layout>
  );
};

export default Booking;
