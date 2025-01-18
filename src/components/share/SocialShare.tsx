import React from 'react';
import { Instagram, Twitter, Linkedin, Music2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { Platform } from '../PostWizard';

interface SocialShareProps {
  platform: Platform;
  imageUrl: string;
  caption: string;
}

export const SocialShare = ({ platform, imageUrl, caption }: SocialShareProps) => {
  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Share your post',
        text: caption,
        url: imageUrl,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: `Your post has been shared to ${platform}`,
        });
      } else {
        window.open(
          `https://${platform.toLowerCase()}.com/share?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(caption)}`,
          '_blank'
        );
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "There was an error sharing your post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'Instagram':
        return <Instagram />;
      case 'Twitter':
        return <Twitter />;
      case 'LinkedIn':
        return <Linkedin />;
      case 'TikTok':
        return <Music2 />;
      default:
        return null;
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className="flex items-center gap-2"
    >
      {getPlatformIcon()}
      {platform}
    </Button>
  );
};