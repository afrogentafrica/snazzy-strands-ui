
import React from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type BookingHeaderProps = {
  barber: {
    name: string;
    image: string;
    location: string;
  };
};

const BookingHeader = ({ barber }: BookingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
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
    </>
  );
};

export default BookingHeader;
