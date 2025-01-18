import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface MediaDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  onCameraStart: () => void;
}

export const MediaDropzone = ({ onDrop, onCameraStart }: MediaDropzoneProps) => {
  const isMobile = useIsMobile();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    },
    multiple: false
  });

  return (
    <Card className="p-8">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-6 p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive ? 'Drop your media here' : 'Upload your media'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isMobile ? 'Tap to select or capture' : 'Drag & drop or click to select'}
          </p>
        </div>
      </div>

      {isMobile && (
        <div className="mt-6 flex justify-center">
          <Button onClick={onCameraStart} variant="outline" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Open Camera
          </Button>
        </div>
      )}
    </Card>
  );
};