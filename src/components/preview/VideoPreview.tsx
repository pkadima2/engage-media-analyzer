import React from 'react';

interface VideoPreviewProps {
  src: string;
  className?: string;
}

export const VideoPreview = ({ src, className }: VideoPreviewProps) => {
  return (
    <video 
      controls
      className={`w-full h-auto rounded-lg ${className || ''}`}
      preload="metadata"
    >
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  );
};