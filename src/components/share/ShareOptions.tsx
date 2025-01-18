import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { Instagram, Twitter, Linkedin, Facebook, Share2, Download, Link2, Music2 } from 'lucide-react';
import { Platform } from '../PostWizard';
import { initFacebookSDK } from '@/utils/facebook-config';

interface ShareOptionsProps {
  imageUrl: string;
  caption: string;
  platform: Platform;
}

export const ShareOptions = ({ imageUrl, caption, platform }: ShareOptionsProps) => {
  const brandedCaption = `${caption}\n\nCreated with @EngagePerfect ✨`;

  useEffect(() => {
    // Initialize Facebook SDK when component mounts
    initFacebookSDK();
  }, []);

  const handleFacebookShare = () => {
    const FB = (window as any).FB;
    if (!FB) {
      toast({
        title: "Share failed",
        description: "Facebook sharing is not available at the moment",
        variant: "destructive",
      });
      return;
    }

    FB.ui({
      method: 'share',
      href: imageUrl,
      quote: brandedCaption,
    }, (response: any) => {
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

  const handleShare = async (targetPlatform: Platform) => {
    try {
      if (targetPlatform === 'Facebook') {
        handleFacebookShare();
        return;
      }

      const shareData = {
        title: 'Share your post',
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
        const platformUrls: Record<Platform, string> = {
          Twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(brandedCaption)}&url=${encodeURIComponent(imageUrl)}`,
          LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageUrl)}`,
          Instagram: '#', // Instagram doesn't support direct sharing via URL
          Facebook: '#',
          TikTok: '#'
        };

        if (platformUrls[targetPlatform] !== '#') {
          window.open(platformUrls[targetPlatform], '_blank');
        } else {
          toast({
            title: "Share not available",
            description: `Direct sharing to ${targetPlatform} is not supported. Please copy the link and share manually.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
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

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'engageperfect-post.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download complete",
        description: "Your image has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image",
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case 'Instagram':
        return <Instagram />;
      case 'Twitter':
        return <Twitter />;
      case 'LinkedIn':
        return <Linkedin />;
      case 'Facebook':
        return <Facebook />;
      case 'TikTok':
        return <Music2 />;
      default:
        return <Share2 />;
    }
  };

  const platforms: Platform[] = ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Share Your Post</h3>
      
      {/* Primary share button for selected platform */}
      <Button 
        className="w-full"
        onClick={() => handleShare(platform)}
      >
        {getPlatformIcon(platform)}
        Share to {platform}
      </Button>

      {/* Other platform buttons */}
      <div className="grid grid-cols-2 gap-2">
        {platforms
          .filter(p => p !== platform)
          .map(p => (
            <Button
              key={p}
              variant="outline"
              onClick={() => handleShare(p)}
              className="flex items-center gap-2"
            >
              {getPlatformIcon(p)}
              {p}
            </Button>
          ))}
      </div>

      {/* Copy and Download buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={handleCopyLink}
          className="flex items-center gap-2"
        >
          <Link2 />
          Copy Link
        </Button>
        <Button
          variant="secondary"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download />
          Download
        </Button>
      </div>
    </div>
  );
};
