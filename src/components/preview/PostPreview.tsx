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

  return (
    <div className="space-y-6">
      <Card className="p-6">
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
                <p className="text-sm text-foreground mt-4 whitespace-pre-wrap">
                  {caption}
                </p>
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