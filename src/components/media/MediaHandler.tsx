import React from 'react';
import { Card } from '../ui/card';
import { VideoPreview } from '../preview/VideoPreview';
import { CaptionOverlay } from './CaptionOverlay';

interface MediaHandlerProps {
  src: string;
  caption?: string;
  fileType?: string;
  overlayEnabled?: boolean;
}

export const MediaHandler = ({ src, caption, fileType, overlayEnabled }: MediaHandlerProps) => {
  const formatCaption = (caption: string) => {
    if (!caption) return '';
    return caption.replace(/\*\*(.*?)\*\*/g, '$1').trim();
  };

  const isVideo = fileType?.startsWith('video/');

  if (!src) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Upload media to see the preview
        </p>
      </Card>
    );
  }

  if (isVideo) {
    return (
      <div className="relative">
        <VideoPreview src={src} />
        {overlayEnabled && caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50">
            <p className="text-white text-center">{formatCaption(caption)}</p>
          </div>
        )}
      </div>
    );
  }

  return overlayEnabled ? (
    <CaptionOverlay imageUrl={src} caption={formatCaption(caption || '')} />
  ) : (
    <img 
      src={src} 
      alt="Preview" 
      className="w-full h-auto rounded-lg shadow-lg"
    />
  );
};