import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
}

export const UploadProgress = ({ progress, isUploading }: UploadProgressProps) => {
  if (!isUploading) return null;

  return (
    <div className="space-y-2">
      <Progress value={progress} />
      <p className="text-sm text-center text-muted-foreground">
        Uploading... {progress}%
      </p>
    </div>
  );
};