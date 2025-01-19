import React, { useEffect } from 'react';
import { Instagram, Twitter, Linkedin, Facebook, Music2, Share2, Download, Link2 } from 'lucide-react';
import { Platform } from '../PostWizard';
import { SocialButton } from './SocialButton';
import { downloadPost, copyToClipboard, shareToLinkedIn } from '@/utils/shareUtils';
import { toast } from '@/hooks/use-toast';

interface ShareOptionsProps {
  imageUrl: string;
  caption: string;
  platform: Platform;
}

export const ShareOptions = ({ imageUrl, caption, platform }: ShareOptionsProps) => {
  const FB_APP_ID = '1602291440389010';
  const brandedCaption = `${caption}\n\nCreated with @EngagePerfect ✨`;

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
      href: window.location.href,
      quote: brandedCaption
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
          shareToLinkedIn(window.location.href, brandedCaption);
          break;
        case 'Facebook':
          handleFacebookShare();
          break;
        case 'Twitter':
          const twitterUrl = new URL('https://twitter.com/intent/tweet');
          const twitterParams = new URLSearchParams({
            text: brandedCaption,
            url: window.location.href,
            via: 'EngagePerfect'
          });
          window.open(`${twitterUrl}?${twitterParams}`, '_blank');
          break;
        default:
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'share-image.jpg', { 
            type: blob.type,
            lastModified: Date.now()
          });
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Share your post',
              text: brandedCaption,
              url: window.location.href,
              files: [file]
            });
            toast({
              title: "Shared successfully",
              description: `Your post has been shared to ${targetPlatform}`,
            });
          } else {
            const shareUrl = `https://${targetPlatform.toLowerCase()}.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(brandedCaption)}`;
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

  const platforms: Platform[] = ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Share Your Post</h3>
      
      <SocialButton
        icon={getPlatformIcon(platform)}
        platform={`Share to ${platform}`}
        onClick={() => handleShare(platform)}
      />

      <div className="grid grid-cols-2 gap-2">
        {platforms
          .filter(p => p !== platform)
          .map(p => (
            <SocialButton
              key={p}
              icon={getPlatformIcon(p)}
              platform={p}
              onClick={() => handleShare(p)}
              variant="outline"
            />
          ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SocialButton
          icon={Link2}
          platform="Copy Link"
          onClick={() => copyToClipboard(imageUrl, brandedCaption)}
          variant="secondary"
        />
        <SocialButton
          icon={Download}
          platform="Download"
          onClick={() => {
            const previewCard = document.querySelector('.preview-card') as HTMLElement;
            downloadPost(previewCard);
          }}
          variant="secondary"
        />
      </div>
    </div>
  );
};

const getPlatformIcon = (p: Platform) => {
  switch (p) {
    case 'Instagram':
      return Instagram;
    case 'Twitter':
      return Twitter;
    case 'LinkedIn':
      return Linkedin;
    case 'Facebook':
      return Facebook;
    case 'TikTok':
      return Music2;
    default:
      return Share2;
  }
};