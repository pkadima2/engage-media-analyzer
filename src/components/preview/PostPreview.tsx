import React from 'react';
import { Card } from '../ui/card';
import { CaptionPreview } from './CaptionPreview';
import { ShareOptions } from '../share/ShareOptions';
import { Platform } from '../PostWizard';

interface PostPreviewProps {
  imageUrl: string;
  caption: string;
  overlayEnabled: boolean;
  platform?: Platform;
}

export const PostPreview = ({ imageUrl, caption, overlayEnabled, platform }: PostPreviewProps) => {
  if (!imageUrl) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Upload an image to see the preview
        </p>
      </Card>
    );
  }

  const formatCaption = (caption: string) => {
    const titleMatch = caption.match(/\*\*(.*?)\*\*/);
    if (titleMatch) {
      const title = titleMatch[1];
      const rest = caption.replace(/\*\*.*?\*\*/, '').trim();
      return (
        <>
          <p className="font-bold text-base mb-2">{`**${title}**`}</p>
          <p>{rest}</p>
        </>
      );
    }
    return caption;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 preview-card">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="space-y-4">
          {overlayEnabled ? (
            <CaptionPreview imageUrl={imageUrl} caption={caption} />
          ) : (
            <>
              <img 
                src={imageUrl} 
                alt="Post preview" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              {caption && (
                <div className="text-sm text-foreground mt-4 whitespace-pre-wrap">
                  {formatCaption(caption)}
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {platform && (
        <Card className="p-6">
          <ShareOptions
            imageUrl={imageUrl}
            caption={caption}
            platform={platform}
          />
        </Card>
      )}
    </div>
  );
};