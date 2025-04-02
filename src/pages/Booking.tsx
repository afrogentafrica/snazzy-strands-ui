
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import DateSelector from "@/components/booking/DateSelector";
import TimeSelector from "@/components/booking/TimeSelector";

const BARBER_DATA = {
  id: "1",
  name: "Allen Markel",
  image: "/lovable-uploads/c7fe7ee0-59e6-4444-86c5-fd295774ad61.png",
  location: "Old Cutler Rd, Cutler Bay",
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
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[1].date);
  const [selectedTime, setSelectedTime] = useState(AVAILABLE_TIMES[4]);

  // In a real app, we would fetch the barber data based on the id
  const barber = BARBER_DATA;

  const handleBooking = () => {
    // In a real app, we would submit the booking data to an API
    alert(`Booking confirmed for ${selectedDate} at ${selectedTime}`);
    navigate("/");
  };

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
          className="barber-button w-full justify-center mt-4"
        >
          Confirm Booking
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </Layout>
  );
};

export default Booking;
