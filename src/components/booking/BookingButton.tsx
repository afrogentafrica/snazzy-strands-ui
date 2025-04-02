
import React from "react";
import { ChevronRight } from "lucide-react";

type BookingButtonProps = {
  onBooking: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
};

const BookingButton = ({ 
  onBooking, 
  isSubmitting, 
  isDisabled 
}: BookingButtonProps) => {
  return (
    <button
      onClick={onBooking}
      disabled={isDisabled || isSubmitting}
      className={`barber-button w-full justify-center mt-4 ${
        (isDisabled || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isSubmitting ? "Processing..." : "Confirm Booking"}
      <ChevronRight className="w-5 h-5" />
    </button>
  );
};

export default BookingButton;
