
import React from "react";
import DateSelector from "@/components/booking/DateSelector";
import TimeSelector from "@/components/booking/TimeSelector";

type BookingSlotsProps = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  availableDates: {
    day: number;
    month: string;
    weekday: string;
    date: string;
  }[];
  availableTimes: string[];
};

const BookingSlots = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  availableDates,
  availableTimes
}: BookingSlotsProps) => {
  return (
    <div className="bg-barber-card rounded-3xl p-5 mb-6">
      <h2 className="font-bold text-lg mb-2">Available Slots</h2>
      <div className="mb-2 text-sm text-gray-400">Select Date</div>
      
      {/* Date selector */}
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dates={availableDates}
      />

      {/* Time selector */}
      <TimeSelector
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        availableTimes={availableTimes}
      />
    </div>
  );
};

export default BookingSlots;
