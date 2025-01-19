import React from 'react';
import { Facebook } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';

interface FacebookShareProps {
  imageUrl: string;
  caption: string;
}

export const FacebookShare = ({ imageUrl, caption }: FacebookShareProps) => {
  const handleFacebookShare = () => {
    if (!window.FB) {
      toast({
        title: "Share failed",
        description: "Facebook SDK not loaded. Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }
  
    window.FB.ui({
      method: 'share',
      href: imageUrl,
      quote: caption,
    }, function(response) {
      if (response && !response.error_message) {
        toast({
          title: "Shared successfully",
          description: "Your post has been shared to Facebook",
        });
      } else {
        toast({
          title: "Share failed",
          description: "There was an error sharing to Facebook",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleFacebookShare}
      className="flex items-center gap-2"
    >
      <Facebook className="h-4 w-4" />
      Facebook
    </Button>
  );
};