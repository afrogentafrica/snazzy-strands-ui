
import React from "react";

type ServiceCardProps = {
  name: string;
  price: string;
  isPopular?: boolean;
};

const ServiceCard = ({ name, price, isPopular = false }: ServiceCardProps) => {
  return (
    <div className="bg-barber-card rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{name}</p>
        {isPopular && (
          <span className="bg-barber-accent/20 text-barber-accent text-xs px-2 py-0.5 rounded-full">
            Popular
          </span>
        )}
      </div>
      <div className="text-lg font-bold">${price}</div>
    </div>
  );
};

export default ServiceCard;
