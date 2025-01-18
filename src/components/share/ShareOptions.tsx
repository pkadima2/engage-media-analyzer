import React from 'react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { Instagram, Twitter, Linkedin, Facebook, Music2, Share2, Download, Link2 } from 'lucide-react';
import { Platform } from '../PostWizard';
import html2canvas from 'html2canvas';

interface ShareOptionsProps {
  imageUrl: string;
  caption: string;
  platform: Platform;
}

export const ShareOptions = ({ imageUrl, caption, platform }: ShareOptionsProps) => {
  const brandedCaption = `${caption}\n\nCreated with @EngagePerfect ✨`;
  const FB_APP_ID = '1602291440389010';

  const handleFacebookShare = async () => {
    try {
      // Initialize Facebook SDK
      if (!window.FB) {
        window.FB = await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://connect.facebook.net/en_US/sdk.js';
          script.async = true;
          script.defer = true;
          script.crossOrigin = 'anonymous';
          document.body.appendChild(script);
          
          window.fbAsyncInit = () => {
            FB.init({
              appId: FB_APP_ID,
              version: 'v18.0',
              xfbml: true
            });
            resolve(FB);
          };
        });
      }

      // Share to Facebook
      FB.ui({
        method: 'share',
        href: imageUrl,
        quote: brandedCaption,
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
    } catch (error) {
      toast({
        title: "Share failed",
        description: "There was an error initializing Facebook sharing",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (targetPlatform: Platform) => {
    if (targetPlatform === 'Facebook') {
      await handleFacebookShare();
      return;
    }

    try {
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
        window.open(`https://${targetPlatform.toLowerCase()}.com/share?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(brandedCaption)}`, '_blank');
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
      // Find the preview card element
      const previewCard = document.querySelector('.preview-card') as HTMLElement;
      if (!previewCard) {
        throw new Error('Preview card not found');
      }

      // Use html2canvas to capture the entire card
      const canvas = await html2canvas(previewCard, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
      });

      // Convert to blob and download
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob(blob => resolve(blob!), 'image/png', 1.0)
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'engageperfect-post.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download complete",
        description: "Your post has been downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the post",
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
        return <Music2 />; // Using Music2 icon as an alternative for TikTok
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