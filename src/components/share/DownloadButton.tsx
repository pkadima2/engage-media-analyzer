import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface DownloadButtonProps {
  caption: string;
}

export const DownloadButton = ({ caption }: DownloadButtonProps) => {
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

  return (
    <Button
      variant="secondary"
      onClick={handleDownload}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Download
    </Button>
  );
};