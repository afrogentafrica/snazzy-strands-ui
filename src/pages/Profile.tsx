
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import LogoutButton from "@/components/profile/LogoutButton";

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
        
        <ProfileHeader 
          fullName={profile.fullName} 
          email={user?.email} 
          avatarUrl={profile.avatarUrl} 
        />

        <ProfileForm 
          profile={profile}
          setProfile={setProfile}
          handleSaveProfile={handleSaveProfile}
          isLoading={isLoading}
        />

        <LogoutButton onLogout={handleLogout} />
      </div>
    </Layout>
  );
};

export default Profile;
