import React, { useEffect } from 'react';
import { Instagram, Twitter, Linkedin, Facebook, Music2, Share2, Download, Link2 } from 'lucide-react';
import { Platform } from '../PostWizard';
import { SocialButton } from './SocialButton';
import { downloadPost, copyToClipboard } from '@/utils/shareUtils';
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
    // Load Facebook SDK
    const loadFacebookSDK = () => {
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
    };

    // Load LinkedIn SDK
    const loadLinkedInSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://platform.linkedin.com/in.js';
      script.type = 'text/javascript';
      script.innerHTML = `lang: en_US\napi_key: YOUR_API_KEY`;
      document.body.appendChild(script);
    };

    loadFacebookSDK();
    loadLinkedInSDK();
  }, []);

  const handleFacebookShare = async () => {
    if (!window.FB) {
      toast({
        title: "Share failed",
        description: "Facebook SDK not loaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await window.FB.ui({
        method: 'share',
        href: imageUrl,
        quote: brandedCaption,
        hashtag: '#EngagePerfect'
      });
      
      toast({
        title: "Shared successfully",
        description: "Your post has been shared to Facebook",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "There was an error sharing to Facebook",
        variant: "destructive",
      });
    }
  };

  const handleLinkedInShare = async () => {
    try {
      const shareUrl = encodeURIComponent(imageUrl);
      const shareTitle = encodeURIComponent('Check out my post');
      const shareDescription = encodeURIComponent(brandedCaption);
      
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}&summary=${shareDescription}`;
      
      const width = 550;
      const height = 400;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      
      window.open(
        linkedInUrl,
        'Share on LinkedIn',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );

      toast({
        title: "Share initiated",
        description: "LinkedIn sharing window opened",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to share to LinkedIn",
        variant: "destructive",
      });
    }
  };

  const handleTwitterShare = () => {
    try {
      const twitterUrl = new URL('https://twitter.com/intent/tweet');
      const params = new URLSearchParams({
        text: brandedCaption,
        url: imageUrl,
        via: 'EngagePerfect'
      });
      window.open(`${twitterUrl}?${params}`, '_blank');
      
      toast({
        title: "Share initiated",
        description: "Twitter sharing window opened",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to share to Twitter",
        variant: "destructive",
      });
    }
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
        case 'Twitter':
          handleTwitterShare();
          break;
        default:
          // Native share for other platforms
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
              url: imageUrl,
              files: [file]
            });
            toast({
              title: "Shared successfully",
              description: `Your post has been shared to ${targetPlatform}`,
            });
          } else {
            const shareUrl = `https://${targetPlatform.toLowerCase()}.com/share?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(brandedCaption)}`;
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