import React from 'react';
import { Facebook } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { initFacebookSDK } from '@/utils/facebook-config';

interface FacebookShareProps {
  imageUrl: string;
  caption: string;
}

export const FacebookShare = ({ imageUrl, caption }: FacebookShareProps) => {
  const handleShare = async () => {
    try {
      // Initialize Facebook SDK first
      await initFacebookSDK();
      
      if (!window.FB) {
        throw new Error('Facebook SDK not loaded');
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
            description: response?.error_message || "There was an error sharing to Facebook",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error('Facebook share error:', error);
      toast({
        title: "Share failed",
        description: "There was an error initializing Facebook sharing",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className="flex items-center gap-2"
    >
      <Facebook className="h-4 w-4" />
      Facebook
    </Button>
  );
};