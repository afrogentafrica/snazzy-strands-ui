
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import DateSelector from "@/components/booking/DateSelector";
import TimeSelector from "@/components/booking/TimeSelector";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
    return (
      <Layout hideNav>
        <div className="p-6 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-barber-accent"></div>
        </div>
      </Layout>
    );
  }

  if (!barber) {
    return (
      <Layout hideNav>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Barber not found</h2>
          <button 
            onClick={() => navigate("/")} 
            className="barber-button"
          >
            Go Back Home
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideNav>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full bg-barber-card"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl">Book Now</h1>
          <div className="w-9"></div> {/* Empty div for flex spacing */}
        </div>

        {/* Barber Info */}
        <div className="flex items-center gap-3 p-4 bg-barber-card rounded-2xl mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={barber.image}
              alt={barber.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold">{barber.name}</h2>
            <div className="flex items-center text-xs text-gray-400">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{barber.location}</span>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        {barber.services && barber.services.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Select Service</h2>
            <div className="grid grid-cols-1 gap-2">
              {barber.services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedService?.id === service.id
                      ? "border-barber-accent bg-barber-accent/10"
                      : "border-barber-card bg-barber-card"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-gray-400">{service.duration} min</p>
                    </div>
                    <div className="text-lg font-bold">${service.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Section */}
        <div className="bg-barber-card rounded-3xl p-5 mb-6">
          <h2 className="font-bold text-lg mb-2">Available Slots</h2>
          <div className="mb-2 text-sm text-gray-400">Select Date</div>
          
          {/* Date selector */}
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            dates={AVAILABLE_DATES}
          />

          {/* Time selector */}
          <TimeSelector
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            availableTimes={AVAILABLE_TIMES}
          />
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleBooking}
          disabled={isSubmitting || !selectedService}
          className={`barber-button w-full justify-center mt-4 ${
            (!selectedService || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Processing..." : "Confirm Booking"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </Layout>
  );
};

export default Booking;
