import React from 'react';
import { Card } from '../ui/card';

interface VideoPreviewProps {
  src: string;
  className?: string;
}

export const VideoPreview = ({ src, className }: VideoPreviewProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <video 
        controls
        className="w-full h-auto rounded-lg"
        preload="metadata"
      >
        <source src={src} />
        Your browser does not support the video tag.
      </video>
    </Card>
  );
};