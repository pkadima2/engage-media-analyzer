import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

export const downloadPost = async (previewCard: HTMLElement | null) => {
  try {
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

export const copyToClipboard = async (imageUrl: string, caption: string) => {
  try {
    await navigator.clipboard.writeText(`${imageUrl}\n\n${caption}`);
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

export const shareToLinkedIn = (url: string, caption: string) => {
  try {
    const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
    const params = new URLSearchParams({
      url: url,
      title: 'Check out my post',
      summary: caption,
      source: 'EngagePerfect'
    });
    linkedInUrl.search = params.toString();
    
    const width = 550;
    const height = 400;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    const popup = window.open(
      linkedInUrl.toString(),
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