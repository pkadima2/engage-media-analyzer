import React, { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Platform } from '../PostWizard';
import { initFacebookSDK } from '@/utils/facebook-config';
import { FacebookShare } from './FacebookShare';
import { SocialShare } from './SocialShare';
import { DownloadShare } from './DownloadShare';
import { CopyLink } from './CopyLink';
import html2canvas from 'html2canvas';

interface ShareOptionsProps {
  imageUrl: string;
  caption: string;
  platform: Platform;
}

export const ShareOptions = ({ imageUrl, caption, platform }: ShareOptionsProps) => {
  const brandedCaption = `${caption}\n\nCreated with @EngagePerfect ✨`;

  useEffect(() => {
    initFacebookSDK().catch(error => {
      console.error('Failed to initialize Facebook SDK:', error);
    });
  }, []);

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

  const platforms: Platform[] = ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Share Your Post</h3>
      
      {/* Primary share button for selected platform */}
      {platform === 'Facebook' ? (
        <FacebookShare imageUrl={imageUrl} caption={brandedCaption} />
      ) : (
        <SocialShare platform={platform} imageUrl={imageUrl} caption={brandedCaption} />
      )}

      {/* Other platform buttons */}
      <div className="grid grid-cols-2 gap-2">
        {platforms
          .filter(p => p !== platform)
          .map(p => (
            p === 'Facebook' ? (
              <FacebookShare key={p} imageUrl={imageUrl} caption={brandedCaption} />
            ) : (
              <SocialShare key={p} platform={p} imageUrl={imageUrl} caption={brandedCaption} />
            )
          ))}
      </div>

      {/* Copy and Download buttons */}
      <div className="grid grid-cols-2 gap-2">
        <CopyLink imageUrl={imageUrl} caption={brandedCaption} />
        <DownloadShare onDownload={handleDownload} />
      </div>
    </div>
  );
};