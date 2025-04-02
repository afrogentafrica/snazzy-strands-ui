
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ServiceCard from "@/components/barber/ServiceCard";

const BARBER_DATA = {
  id: "1",
  name: "Allen Markel",
  image: "/lovable-uploads/c7fe7ee0-59e6-4444-86c5-fd295774ad61.png",
  location: "Old Cutler Rd, Cutler Bay",
  rating: 4.3,
  services: [
    { name: "Hair Cut", price: "20.99", isPopular: true },
    { name: "Beard", price: "15.99" },
    { name: "Shampoo", price: "10.99" },
    { name: "Hair Color", price: "25.99" },
    { name: "Kids Cut", price: "15.99" },
    { name: "Buzz Cut", price: "18.99" },
  ],
  description:
    "Barbers benefit from skilled hand-eye coordination when making precise cuts and adding color to hair. In services that require blades, shears and...",
};

const BarberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, we would fetch the barber data based on the id
  const barber = BARBER_DATA;

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
              {barber.services.map((service, index) => (
                <ServiceCard
                  key={index}
                  name={service.name}
                  price={service.price}
                  isPopular={service.isPopular}
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
