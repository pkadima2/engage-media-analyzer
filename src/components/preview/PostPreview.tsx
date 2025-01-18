import React from 'react';
import { Card } from '../ui/card';
import { CaptionPreview } from './CaptionPreview';

interface PostPreviewProps {
  imageUrl: string;
  caption: string;
  overlayEnabled: boolean;
}

export const PostPreview = ({ imageUrl, caption, overlayEnabled }: PostPreviewProps) => {
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
  );
};