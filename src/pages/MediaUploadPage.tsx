import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Camera, RotateCw, Upload, X, Check } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

export const MediaUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [rotation, setRotation] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    },
    multiple: false
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      await videoElement.play();

      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      canvas.getContext('2d')?.drawImage(videoElement, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          setFile(file);
          setPreview(URL.createObjectURL(blob));
        }
        stream.getTracks().forEach(track => track.stop());
      }, 'image/jpeg');
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature.",
        variant: "destructive",
      });
    }
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const uploadMedia = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Apply crop and rotation if needed
      let finalBlob = file;
      if (crop || rotation) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = imageRef.current;

        if (image && ctx) {
          canvas.width = crop ? crop.width : image.width;
          canvas.height = crop ? crop.height : image.height;

          ctx.translate(canvas.width/2, canvas.height/2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.translate(-canvas.width/2, -canvas.height/2);

          if (crop) {
            ctx.drawImage(
              image,
              crop.x,
              crop.y,
              crop.width,
              crop.height,
              0,
              0,
              crop.width,
              crop.height
            );
          } else {
            ctx.drawImage(image, 0, 0);
          }

          const blob = await new Promise<Blob>((resolve) => 
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg')
          );
          finalBlob = new File([blob], file.name, { type: 'image/jpeg' });
        }
      }

      const { error } = await supabase.storage
        .from('media')
        .upload(filePath, finalBlob, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percentage));
          },
        });

      if (error) throw error;

      toast({
        title: "Upload successful",
        description: "Your media has been uploaded successfully.",
      });

      // Navigate back or to the next step
      navigate('/');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading your media.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 space-y-6 animate-fade-up">
      <h1 className="text-2xl font-bold text-center">Upload Media</h1>

      {!preview ? (
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
              <Button onClick={startCamera} variant="outline" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Open Camera
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-6 space-y-6">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => {
                setPreview('');
                setFile(null);
                setCrop(undefined);
                setRotation(0);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
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
            <Button variant="outline" onClick={rotateImage}>
              <RotateCw className="w-4 h-4 mr-2" />
              Rotate
            </Button>
            <Button onClick={uploadMedia} disabled={isUploading}>
              <Check className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default MediaUploadPage;