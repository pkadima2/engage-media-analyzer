import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from './ui/use-toast';

export const MediaUpload = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        onFileSelect(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or video file.",
          variant: "destructive",
        });
      }
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Handle camera stream
      toast({
        title: "Camera accessed",
        description: "You can now capture media.",
      });
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`p-8 transition-all duration-300 ${isDragging ? 'scale-102 border-primary' : ''}`}>
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center gap-6 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Drop your media here</h3>
          <p className="text-sm text-muted-foreground">
            or click to select files
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button onClick={startCamera} variant="outline" className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Open Camera
        </Button>
      </div>
    </Card>
  );
};