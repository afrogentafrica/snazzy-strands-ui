
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ServiceCard from "@/components/barber/ServiceCard";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Barber = {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  description: string;
  services?: Service[];
};

type Service = {
  id: string;
  name: string;
  price: string;
  is_popular: boolean;
};

const BarberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [barber, setBarber] = useState<Barber | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

        // Format prices for display
        const services = servicesData?.map(service => ({
          ...service,
          price: service.price.toString()
        }));

        setBarber({
          ...barberData,
          services
        });
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
      <div className="relative">
        {/* Hero Image */}
        <div className="h-72 relative">
          <img
            src={barber.image}
            alt={barber.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
          
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-6 left-6 bg-black/30 p-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-3 -mt-6 rounded-t-3xl bg-barber-dark relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{barber.name}</h1>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{barber.location}</span>
              </div>
            </div>
            <div className="flex items-center bg-barber-card px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-medium">{barber.rating}</span>
            </div>
          </div>

          {/* Services */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3">Services</h2>
            <div className="grid grid-cols-2 gap-3">
              {barber.services && barber.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  name={service.name}
                  price={service.price}
                  isPopular={service.is_popular}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">About</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {barber.description}
              <button className="text-barber-accent ml-1">Read More</button>
            </p>
          </div>

          {/* Book button */}
          <div className="mt-8 flex">
            <Link to={`/booking/${id}`} className="barber-button flex-1 justify-center">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BarberDetail;
