
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import Index from "./pages/Index";
import BarberDetail from "./pages/BarberDetail";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";

const queryClient = new QueryClient();

const App = () => {
  const supabaseConfigured = isSupabaseConfigured();

  // Display a warning if Supabase isn't configured
  if (!supabaseConfigured) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-barber-dark text-white p-6 flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-4 text-barber-accent">Configuration Error</h1>
        <p className="text-center mb-6">
          Supabase environment variables are missing. Please make sure to set the following environment variables:
        </p>
        <ul className="bg-barber-card p-4 rounded-md w-full mb-6">
          <li className="mb-2"><code>VITE_SUPABASE_URL</code></li>
          <li><code>VITE_SUPABASE_ANON_KEY</code></li>
        </ul>
        <p className="text-sm text-gray-400 text-center">
          These values can be found in your Supabase project settings.
        </p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/barber/:id" element={<BarberDetail />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
