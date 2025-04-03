import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/ui/theme-provider"
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BarberDetail from './pages/BarberDetail';
import Booking from './pages/Booking';
import Appointments from './pages/Appointments';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import AdminDashboard from './pages/AdminDashboard';
import ServiceForm from './pages/ServiceForm';

const queryClient = new QueryClient();

// Update the routes to include the new ServiceForm page
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="barbershop-theme">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/barber/:id" element={<BarberDetail />} />
              <Route path="/booking/:barberId" element={<Booking />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/service" element={<ServiceForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
