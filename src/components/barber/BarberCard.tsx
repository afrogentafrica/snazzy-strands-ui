
import React from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type BarberCardProps = {
  id: string;
  name: string;
  image: string;
  location: string;
  specialty?: string;
};

const BarberCard = ({ id, name, image, location, specialty }: BarberCardProps) => {
  return (
    <Link to={`/barber/${id}`} className="block">
      <div className="barber-card relative mb-4 animate-fade-in">
        <div className="relative h-48 overflow-hidden rounded-2xl mb-3">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            {specialty && <p className="text-sm text-gray-400">{specialty}</p>}
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{location}</span>
            </div>
          </div>
          <div className="bg-barber-card p-2 rounded-full">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BarberCard;
