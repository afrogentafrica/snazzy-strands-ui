
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User, UserCircle2, MapPin, Phone, Save, LogOut } from "lucide-react";

type ProfileData = {
  fullName: string;
  location: string;
  phone: string;
  avatarUrl: string;
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    location: "",
    phone: "",
    avatarUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile({
            fullName: data.full_name || "",
            location: data.location || "",
            phone: data.phone || "",
            avatarUrl: data.avatar_url || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: profile.fullName,
          location: profile.location,
          phone: profile.phone,
          avatar_url: profile.avatarUrl,
          updated_at: new Date(),
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-barber-card rounded-full flex items-center justify-center mb-4">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.fullName || "Profile"} 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <UserCircle2 className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <p className="text-lg font-semibold">{profile.fullName || user?.email}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="pl-10 bg-barber-card border-barber-card"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="Enter your location"
                className="pl-10 bg-barber-card border-barber-card"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="pl-10 bg-barber-card border-barber-card"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="barber-button w-full justify-center"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Profile"}
            <Save className="w-5 h-5" />
          </Button>
        </form>

        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="w-full mt-6 bg-transparent border-barber-card text-white hover:bg-barber-card"
        >
          Sign Out
          <LogOut className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </Layout>
  );
};

export default Profile;
