import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Check } from 'lucide-react';
import { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { supabase } from '@/integrations/supabase/client';
import { MediaDropzone } from '@/components/upload/MediaDropzone';
import { MediaPreview } from '@/components/upload/MediaPreview';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { processMediaFile, type MediaMetadata } from '@/utils/mediaUtils';

export const MediaUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [rotation, setRotation] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

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

  const clearSelection = () => {
    setPreview('');
    setFile(null);
    setCrop(undefined);
    setRotation(0);
  };

  const uploadMedia = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { finalBlob, metadata } = await processMediaFile(
        file,
        crop,
        rotation,
        imageRef.current
      );

      const fileExt = metadata.originalName.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Create a new XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentage = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentage));
        }
      });

      // Upload the file using Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, finalBlob, {
          contentType: metadata.contentType,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Store metadata in the posts table
      const { error: dbError } = await supabase
        .from('posts')
        .insert({
          image_url: publicUrl,
          platform: 'default', // Required field
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: "Your media has been uploaded successfully.",
      });

      navigate('/');
    } catch (error) {
      console.error('Upload error:', error);
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
        <MediaDropzone onDrop={onDrop} onCameraStart={startCamera} />
      ) : (
        <>
          <MediaPreview
            preview={preview}
            crop={crop}
            onCropChange={setCrop}
            rotation={rotation}
            onRotate={rotateImage}
            onClear={clearSelection}
            imageRef={imageRef}
          />
          
          <div className="flex justify-center">
            <Button onClick={uploadMedia} disabled={isUploading}>
              <Check className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>

          <UploadProgress progress={uploadProgress} isUploading={isUploading} />
        </>
      )}
    </div>
  );
};

export default MediaUploadPage;