import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MediaDropzone } from './upload/MediaDropzone';
import { MediaPreview } from './upload/MediaPreview';
import { UploadProgress } from './upload/UploadProgress';
import { processMediaFile } from '@/utils/mediaUtils';
import { CaptionEditor } from './CaptionEditor';
import { PostSteps } from './post/PostSteps';
import { CaptionSettings } from './post/CaptionSettings';
import { PostPreview } from './preview/PostPreview';

export type Platform = 'Instagram' | 'LinkedIn' | 'Facebook' | 'Twitter' | 'TikTok';
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
  const [overlayEnabled, setOverlayEnabled] = useState(false);
  
  // Media upload state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [crop, setCrop] = useState<any>();
  const [rotation, setRotation] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  // Caption generation state
  const [captions, setCaptions] = useState<string[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<string>();
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [imageMetadata, setImageMetadata] = useState<any>(null);

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const generateCaptions = async () => {
    if (!platform || !niche || !goal || !tone || !imageMetadata) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before generating captions.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCaptions(true);
    setCaptions([]); // Clear existing captions

    try {
      console.log('Generating captions with:', { platform, niche, goal, tone, imageMetadata });
      
      const { data, error } = await supabase.functions.invoke('generate-captions', {
        body: { platform, niche, goal, tone, imageMetadata },
      });

      console.log('Response from generate-captions:', data, error);

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.captions || !Array.isArray(data.captions)) {
        throw new Error('Invalid response format from caption generation');
      }

      setCaptions(data.captions);
      setSelectedCaption(data.captions[0]);
      
      toast({
        title: "Captions Generated",
        description: "Your captions have been generated successfully. Choose one or edit them as needed.",
      });
    } catch (error) {
      console.error('Caption generation error:', error);
      toast({
        title: "Caption Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating captions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  const handleNext = async () => {
    if (step === 1 && file && !postId) {
      await uploadMedia();
    } else if (step === 5) {
      await generateCaptions();
      setStep(prev => prev + 1);
    } else {
      setStep(prev => Math.min(6, prev + 1));
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

      setImageMetadata(metadata);

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
          platform: platform || 'default',
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
    if (!postId || !selectedCaption) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          platform,
          niche,
          goal,
          tone,
          selected_caption: selectedCaption
        })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post Created",
        description: "Your post has been created successfully.",
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Error saving post",
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

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">6</div>
              <h2 className="text-xl font-semibold">Generated Captions</h2>
            </div>
            <CaptionSettings
              overlayEnabled={overlayEnabled}
              onOverlayChange={setOverlayEnabled}
            />
            <CaptionEditor
              captions={captions}
              onSelect={setSelectedCaption}
              onEdit={(index, newCaption) => {
                const newCaptions = [...captions];
                newCaptions[index] = newCaption;
                setCaptions(newCaptions);
              }}
              selectedCaption={selectedCaption}
              isLoading={isGeneratingCaptions}
            />
          </div>
        );
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !preview;
      case 2:
        return !platform;
      case 3:
        return !niche;
      case 4:
        return !goal;
      case 5:
        return !tone;
      case 6:
        return !selectedCaption;
      default:
        return false;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <PostSteps
          step={step}
          onBack={handleBack}
          onNext={handleNext}
          onComplete={handleComplete}
          isNextDisabled={isNextDisabled()}
        >
          {renderStep()}
        </PostSteps>
      </Card>

      <div className="sticky top-6">
        <PostPreview 
          imageUrl={preview}
          caption={selectedCaption || ''}
          overlayEnabled={overlayEnabled}
          platform={platform}
        />
      </div>
    </div>
  );
};