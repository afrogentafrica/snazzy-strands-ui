
import React from "react";
import { Clock } from "lucide-react";

type TimeSelectorProps = {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  availableTimes: string[];
};

const TimeSelector = ({ selectedTime, setSelectedTime, availableTimes }: TimeSelectorProps) => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-barber-accent" />
        <h3 className="font-medium">Select Time</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {availableTimes.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`p-3 rounded-xl text-center transition-all ${
              selectedTime === time
                ? "bg-barber-accent text-barber-dark"
                : "bg-barber-card text-foreground"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSelector;
