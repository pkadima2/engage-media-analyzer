import React, { useEffect } from 'react';
import { Link2, Share2, Twitter, Music2, Instagram } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { Platform } from '../PostWizard';
import { LinkedInShare } from './LinkedInShare';
import { FacebookShare } from './FacebookShare';
import { DownloadButton } from './DownloadButton';

interface ShareOptionsProps {
  imageUrl: string;
  caption: string;
  platform: Platform;
}

export const ShareOptions = ({ imageUrl, caption, platform }: ShareOptionsProps) => {
  const brandedCaption = `${caption}\n\nCreated with @EngagePerfect ✨`;
  const FB_APP_ID = '1602291440389010';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
    
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: FB_APP_ID,
        version: 'v18.0',
        xfbml: true
      });
    };
  }, []);

  const handleShare = async (targetPlatform: Platform) => {
    try {
      const shareData = {
        title: 'Check out my post',
        text: brandedCaption,
        url: imageUrl,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: `Your post has been shared to ${targetPlatform}`,
        });
      } else {
        const shareUrl = targetPlatform === 'Twitter' 
          ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(brandedCaption)}&url=${encodeURIComponent(imageUrl)}`
          : `https://${targetPlatform.toLowerCase()}.com/share?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(brandedCaption)}`;
        
        window.open(shareUrl, '_blank');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Share failed",
        description: "There was an error sharing your post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${imageUrl}\n\n${brandedCaption}`);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case 'Instagram':
        return <Instagram className="h-4 w-4" />;
      case 'Twitter':
        return <Twitter className="h-4 w-4" />;
      case 'Facebook':
        return <FacebookShare imageUrl={imageUrl} caption={brandedCaption} />;
      case 'LinkedIn':
        return <LinkedInShare imageUrl={imageUrl} caption={brandedCaption} />;
      case 'TikTok':
        return <Music2 className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Share Your Post</h3>
      
      <Button 
        className="w-full"
        onClick={() => handleShare(platform)}
      >
        {getPlatformIcon(platform)}
        Share to {platform}
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={handleCopyLink}
          className="flex items-center gap-2"
        >
          <Link2 className="h-4 w-4" />
          Copy Link
        </Button>
        <DownloadButton caption={brandedCaption} />
      </div>
    </div>
  );
};