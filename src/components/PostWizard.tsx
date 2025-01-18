import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './ui/use-toast';
import { MediaDropzone } from './upload/MediaDropzone';
import { MediaPreview } from './upload/MediaPreview';
import { UploadProgress } from './upload/UploadProgress';
import { processMediaFile } from '@/utils/mediaUtils';

type Platform = 'Instagram' | 'LinkedIn' | 'Facebook' | 'Twitter' | 'TikTok';
type Goal = 'Sales' | 'Drive Engagement' | 'Grow Followers' | 'Share Knowledge' | 'Brand Awareness';
type Tone = 'Professional' | 'Casual' | 'Humorous' | 'Persuasive' | 'Inspirational';

interface PostWizardProps {
  onComplete: () => void;
}

export const PostWizard = ({ onComplete }: PostWizardProps) => {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<Platform>();
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState<Goal>();
  const [tone, setTone] = useState<Tone>();
  
  // Media upload state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [crop, setCrop] = useState<any>();
  const [rotation, setRotation] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleNext = async () => {
    if (step === 1 && file && !postId) {
      await uploadMedia();
    } else {
      setStep(prev => Math.min(5, prev + 1));
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
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

  const uploadMedia = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { finalBlob, metadata } = await processMediaFile(
        file,
        crop,
        rotation,
        imageRef.current
      );

      const fileExt = metadata.originalName.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, finalBlob, {
          contentType: metadata.contentType,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const { data: post, error: dbError } = await supabase
        .from('posts')
        .insert({
          image_url: publicUrl,
          platform: 'default',
          user_id: user.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setPostId(post.id);
      setStep(2);
      toast({
        title: "Upload successful",
        description: "Your media has been uploaded successfully. Please complete the post details.",
      });
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

  const handleComplete = async () => {
    if (!postId) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          platform,
          niche,
          goal,
          tone
        })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your post settings have been saved successfully.",
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: error instanceof Error ? error.message : "Failed to save post settings",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</div>
              <h2 className="text-xl font-semibold">Upload Media</h2>
            </div>
            {!preview ? (
              <MediaDropzone onDrop={onDrop} onCameraStart={startCamera} />
            ) : (
              <>
                <MediaPreview
                  preview={preview}
                  crop={crop}
                  onCropChange={setCrop}
                  rotation={rotation}
                  onRotate={() => setRotation(prev => (prev + 90) % 360)}
                  onClear={() => {
                    setPreview('');
                    setFile(null);
                  }}
                  imageRef={imageRef}
                />
                {isUploading && (
                  <UploadProgress progress={uploadProgress} isUploading={isUploading} />
                )}
              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</div>
              <h2 className="text-xl font-semibold">Choose Platform</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(['Instagram', 'LinkedIn', 'Facebook', 'Twitter', 'TikTok'] as Platform[]).map((p) => (
                <Button
                  key={p}
                  variant={platform === p ? "default" : "outline"}
                  className="h-12"
                  onClick={() => setPlatform(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">3</div>
              <h2 className="text-xl font-semibold">Industry/Niche</h2>
            </div>
            <Input
              placeholder="e.g., Fitness, Fashion, Technology"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="h-12"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">4</div>
              <h2 className="text-xl font-semibold">Select Goal</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(['Sales', 'Drive Engagement', 'Grow Followers', 'Share Knowledge', 'Brand Awareness'] as Goal[]).map((g) => (
                <Button
                  key={g}
                  variant={goal === g ? "default" : "outline"}
                  className="h-12"
                  onClick={() => setGoal(g)}
                >
                  {g}
                </Button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">5</div>
              <h2 className="text-xl font-semibold">Select Tone</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(['Professional', 'Casual', 'Humorous', 'Persuasive', 'Inspirational'] as Tone[]).map((t) => (
                <Button
                  key={t}
                  variant={tone === t ? "default" : "outline"}
                  className="h-12"
                  onClick={() => setTone(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((number) => (
            <div
              key={number}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === number
                  ? 'bg-primary text-white'
                  : step > number
                  ? 'bg-primary/20 text-primary'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {number}
            </div>
          ))}
        </div>
      </div>

      {renderStep()}

      <div className="flex justify-between mt-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        {step < 5 ? (
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && !preview) ||
              (step === 2 && !platform) ||
              (step === 3 && !niche) ||
              (step === 4 && !goal)
            }
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!tone}
          >
            Complete
          </Button>
        )}
      </div>
    </Card>
  );
};