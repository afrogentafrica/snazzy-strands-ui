
import React from "react";
import { cn } from "@/lib/utils";

type DateSelectorProps = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  dates: {
    day: number;
    month: string;
    weekday: string;
    date: string;
  }[];
};

const DateSelector = ({ selectedDate, setSelectedDate, dates }: DateSelectorProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-4 hide-scrollbar">
      {dates.map((date) => (
        <button
          key={date.date}
          onClick={() => setSelectedDate(date.date)}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl p-2 min-w-16 transition-all",
            selectedDate === date.date
              ? "bg-barber-accent text-barber-dark"
              : "bg-barber-card text-foreground"
          )}
        >
          <span className="text-xs opacity-80">{date.month}</span>
          <span className="text-lg font-bold">{date.day}</span>
          <span className="text-xs opacity-80">{date.weekday}</span>
        </button>
      ))}
    </div>
  );
};

export default DateSelector;
