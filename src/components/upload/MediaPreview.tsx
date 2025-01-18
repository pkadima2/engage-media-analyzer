import React from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { X, RotateCw } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MediaPreviewProps {
  preview: string;
  crop?: Crop;
  onCropChange: (c: Crop) => void;
  rotation: number;
  onRotate: () => void;
  onClear: () => void;
  imageRef: React.RefObject<HTMLImageElement>;
}

export const MediaPreview = ({
  preview,
  crop,
  onCropChange,
  rotation,
  onRotate,
  onClear,
  imageRef
}: MediaPreviewProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={onClear}
        >
          <X className="w-4 h-4" />
        </Button>
        
        <ReactCrop
          crop={crop}
          onChange={onCropChange}
          className="max-h-[60vh] overflow-hidden rounded-lg"
        >
          <img
            ref={imageRef}
            src={preview}
            alt="Preview"
            style={{ transform: `rotate(${rotation}deg)` }}
            className="max-w-full h-auto"
          />
        </ReactCrop>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onRotate}>
          <RotateCw className="w-4 h-4 mr-2" />
          Rotate
        </Button>
      </div>
    </Card>
  );
};