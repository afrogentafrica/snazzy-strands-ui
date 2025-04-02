
import React from "react";
import { User, MapPin, Phone, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ProfileData = {
  fullName: string;
  location: string;
  phone: string;
  avatarUrl: string;
};

type ProfileFormProps = {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  handleSaveProfile: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  profile, 
  setProfile, 
  handleSaveProfile, 
  isLoading 
}) => {
  return (
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
  );
};

export default ProfileForm;
