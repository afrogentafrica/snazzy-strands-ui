
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Loader2 className="w-12 h-12 animate-spin text-barber-accent" />
      <p className="mt-4 text-lg">Checking admin setup...</p>
    </div>
  );
};

export default LoadingState;
