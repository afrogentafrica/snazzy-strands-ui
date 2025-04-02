
import React from "react";

type Service = {
  id: string;
  name: string;
  price: string;
  duration: number;
};

type ServiceSelectorProps = {
  services: Service[] | undefined;
  selectedService: Service | null;
  setSelectedService: (service: Service) => void;
};

const ServiceSelector = ({ 
  services, 
  selectedService, 
  setSelectedService 
}: ServiceSelectorProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="font-bold text-lg mb-2">Select Service</h2>
      <div className="grid grid-cols-1 gap-2">
        {services.map((service) => (
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
  );
};

export default ServiceSelector;
