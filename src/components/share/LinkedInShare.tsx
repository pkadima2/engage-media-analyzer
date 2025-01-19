import React from 'react';
import { Linkedin } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';

interface LinkedInShareProps {
  imageUrl: string;
  caption: string;
}

export const LinkedInShare = ({ imageUrl, caption }: LinkedInShareProps) => {
  const handleLinkedInShare = () => {
    try {
      // Format content for LinkedIn
      const content = {
        title: caption.split('\n')[0], // First line as title
        summary: caption,
        source: window.location.origin,
        imageUrl: imageUrl,
      };

      // LinkedIn sharing URL with content
      const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(content.source)}&title=${encodeURIComponent(content.title)}&summary=${encodeURIComponent(content.summary)}&source=${encodeURIComponent(content.source)}`;
      
      // Open popup window
      const width = 550;
      const height = 400;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      
      const popup = window.open(
        linkedInUrl,
        'Share on LinkedIn',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );

      if (popup) {
        popup.focus();
        toast({
          title: "Share initiated",
          description: "LinkedIn sharing window opened",
        });
      } else {
        throw new Error('Popup blocked');
      }
    } catch (error) {
      console.error('LinkedIn share error:', error);
      toast({
        title: "Share failed",
        description: "Failed to open LinkedIn sharing window. Please check your popup blocker settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLinkedInShare}
      className="flex items-center gap-2"
    >
      <Linkedin className="h-4 w-4" />
      LinkedIn
    </Button>
  );
};