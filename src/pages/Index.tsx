
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import FilterTabs from "@/components/barber/FilterTabs";
import BarberCard from "@/components/barber/BarberCard";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Barber = {
  id: string;
  name: string;
  image: string;
  location: string;
  specialty?: string;
};

const FILTERS = ["All", "Hair", "Beard", "Color", "Styling"];

const Index = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [user] = useState({
    name: "Allen Roy",
    location: "Old Cutler Rd",
    avatar: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?q=80&w=2688&auto=format&fit=crop",
  });

  useEffect(() => {
    const fetchBarbers = async () => {
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from("barbers")
          .select("*");

        if (error) {
          throw error;
        }

        setBarbers(data || []);
      } catch (error) {
        console.error("Error fetching barbers:", error);
        toast({
          title: "Error",
          description: "Could not load barber information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbers();
  }, [toast]);

  return (
    <Layout>
      <div className="p-6 pt-8">
        {/* User header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <div className="flex items-center text-xs text-gray-400">
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterTabs
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filters={FILTERS}
          />
        </div>

        {/* Barbers List */}
        {isLoading ? (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-barber-accent"></div>
          </div>
        ) : (
          <div className="mt-6">
            {barbers.length === 0 ? (
              <p className="text-center text-gray-400 mt-8">No barbers found</p>
            ) : (
              barbers.map((barber) => (
                <BarberCard
                  key={barber.id}
                  id={barber.id}
                  name={barber.name}
                  image={barber.image}
                  location={barber.location}
                  specialty={barber.specialty}
                />
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
