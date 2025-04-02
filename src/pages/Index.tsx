
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import FilterTabs from "@/components/barber/FilterTabs";
import BarberCard from "@/components/barber/BarberCard";

const BARBER_DATA = [
  {
    id: "1",
    name: "Allen Markel",
    image: "/lovable-uploads/c7fe7ee0-59e6-4444-86c5-fd295774ad61.png",
    location: "Old Cutler Rd, Cutler Bay",
    specialty: "Precision Cuts",
  },
  {
    id: "2",
    name: "Nohita Kneet",
    image: "https://images.unsplash.com/photo-1617481123070-9092b2f4518e?q=80&w=2670&auto=format&fit=crop",
    location: "Downtown Miami",
    specialty: "Hair Stylist",
  },
  {
    id: "3",
    name: "Mike Stevens",
    image: "https://images.unsplash.com/photo-1622296089403-47b0b49551fc?q=80&w=2670&auto=format&fit=crop",
    location: "Brickell Ave",
    specialty: "Beard Specialist",
  },
];

const FILTERS = ["All", "Hair", "Beard", "Color", "Styling"];

const Index = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [user] = useState({
    name: "Allen Roy",
    location: "Old Cutler Rd",
    avatar: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?q=80&w=2688&auto=format&fit=crop",
  });

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
        <div className="mt-6">
          {BARBER_DATA.map((barber) => (
            <BarberCard
              key={barber.id}
              id={barber.id}
              name={barber.name}
              image={barber.image}
              location={barber.location}
              specialty={barber.specialty}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
