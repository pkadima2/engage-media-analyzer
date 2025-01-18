import React from 'react';
import { Link2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';

interface CopyLinkProps {
  imageUrl: string;
  caption: string;
}

export const CopyLink = ({ imageUrl, caption }: CopyLinkProps) => {
  const handleCopyLink = async () => {
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

  return (
    <Button
      variant="secondary"
      onClick={handleCopyLink}
      className="flex items-center gap-2"
    >
      <Link2 />
      Copy Link
    </Button>
  );
};