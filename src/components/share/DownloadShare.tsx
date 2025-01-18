import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface DownloadShareProps {
  onDownload: () => Promise<void>;
}

export const DownloadShare = ({ onDownload }: DownloadShareProps) => {
  return (
    <Button
      variant="secondary"
      onClick={onDownload}
      className="flex items-center gap-2"
    >
      <Download />
      Download
    </Button>
  );
};