import React, { useEffect } from 'react';
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

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageUrl)}&summary=${encodeURIComponent(brandedCaption)}`;
    
    const width = 550;
    const height = 400;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      linkedInUrl,
      'Share on LinkedIn',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    toast({
      title: "Share initiated",
      description: "LinkedIn sharing window opened",
    });
  };

  const handleFacebookShare = () => {
    if (!window.FB) {
      toast({
        title: "Share failed",
        description: "Please try again in a moment",
        variant: "destructive",
      });
      return;
    }
  
    window.FB.ui({
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
  };

  const handleShare = async (targetPlatform: Platform) => {
    try {
      switch (targetPlatform) {
        case 'LinkedIn':
          handleLinkedInShare();
          break;
        case 'Facebook':
          handleFacebookShare();
          break;
        default:
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
            const shareUrl = targetPlatform === 'Twitter' 
              ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(brandedCaption)}&url=${encodeURIComponent(imageUrl)}`
              : `https://${targetPlatform.toLowerCase()}.com/share?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(brandedCaption)}`;
            
            window.open(shareUrl, '_blank');
          }
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

  const handleDownload = async () => {
    try {
      const previewCard = document.querySelector('.preview-card') as HTMLElement;
      if (!previewCard) {
        throw new Error('Preview card not found');
      }

      const canvas = await html2canvas(previewCard, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
      });

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
        return <Music2 />;
      default:
        return <Share2 />;
    }
  };

  const platforms: Platform[] = ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok'];

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
