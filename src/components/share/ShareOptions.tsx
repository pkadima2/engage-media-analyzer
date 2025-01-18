import React from 'react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { Instagram, Twitter, Linkedin, Facebook, Music2, Share2, Download, Link2 } from 'lucide-react';
import { Platform } from '../PostWizard';

interface ShareOptionsProps {
  imageUrl: string;
  caption: string;
  platform: Platform;
}

export const ShareOptions = ({ imageUrl, caption, platform }: ShareOptionsProps) => {
  const brandedCaption = `${caption}\n\nCreated with @EngagePerfect ✨`;

  const handleShare = async (targetPlatform: Platform) => {
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
      // Create a canvas to combine image and caption
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Load the image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height + 200; // Extra space for caption

      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Configure text style
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'left';

      // Draw caption
      const words = brandedCaption.split(' ');
      let line = '';
      let y = img.height + 30;
      const maxWidth = canvas.width - 40;
      const lineHeight = 20;

      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
          ctx.fillText(line, 20, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, 20, y);

      // Convert to blob and download
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob(blob => resolve(blob!)));
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