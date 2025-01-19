import React from 'react';
import { Button } from '../ui/button';
import { LucideIcon } from 'lucide-react';

interface SocialButtonProps {
  icon: LucideIcon;
  platform: string;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
}

export const SocialButton = ({ icon: Icon, platform, onClick, variant = "default" }: SocialButtonProps) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <Icon className="w-4 h-4" />
      {platform}
    </Button>
  );
};