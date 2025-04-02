
import React from "react";
import { UserCircle2 } from "lucide-react";

type ProfileHeaderProps = {
  fullName: string;
  email: string | undefined;
  avatarUrl: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ fullName, email, avatarUrl }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 bg-barber-card rounded-full flex items-center justify-center mb-4">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={fullName || "Profile"} 
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <UserCircle2 className="w-16 h-16 text-gray-400" />
        )}
      </div>
      <p className="text-lg font-semibold">{fullName || email}</p>
      <p className="text-sm text-gray-400">{email}</p>
    </div>
  );
};

export default ProfileHeader;
