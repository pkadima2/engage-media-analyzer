import React, { useState } from 'react';
import { MediaUpload } from '@/components/MediaUpload';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('GOOGLE_VISION_API_KEY') || '');

  const analyzeImage = async (base64Image: string) => {
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image.split(',')[1]
          },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'IMAGE_PROPERTIES' },
            { type: 'FACE_DETECTION' },
            { type: 'OBJECT_LOCALIZATION' },
            { type: 'LANDMARK_DETECTION' },
            { type: 'SAFE_SEARCH_DETECTION' }
          ]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Process and structure the response
    const result = data.responses[0];
    return {
      environment: {
        labels: result.labelAnnotations?.map((label: any) => ({
          description: label.description,
          confidence: (label.score * 100).toFixed(1) + '%'
        })) || [],
        colors: result.imagePropertiesAnnotation?.dominantColors?.colors?.map((color: any) => ({
          rgb: `rgb(${color.color.red}, ${color.color.green}, ${color.color.blue})`,
          score: (color.score * 100).toFixed(1) + '%'
        })) || []
      },
      context: {
        objects: result.localizedObjectAnnotations?.map((obj: any) => ({
          name: obj.name,
          confidence: (obj.score * 100).toFixed(1) + '%'
        })) || [],
        landmarks: result.landmarkAnnotations?.map((landmark: any) => ({
          name: landmark.description,
          confidence: (landmark.score * 100).toFixed(1) + '%'
        })) || []
      },
      mood: {
        faces: result.faceAnnotations?.map((face: any) => ({
          joy: face.joyLikelihood,
          sorrow: face.sorrowLikelihood,
          anger: face.angerLikelihood,
          surprise: face.surpriseLikelihood
        })) || [],
        safety: result.safeSearchAnnotation || {}
      }
    };
  };

  const handleFileSelect = async (file: File) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Cloud Vision API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result);
        reader.readAsDataURL(file);
      });

      const base64Image = await base64Promise as string;
      const analysisResult = await analyzeImage(base64Image);
      
      setResult(analysisResult);
      toast({
        title: "Analysis Complete",
        description: "Your media has been successfully analyzed.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "There was an error analyzing your media.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem('GOOGLE_VISION_API_KEY', apiKey);
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved securely.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-4xl py-12 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">EngagePerfect</h1>
          <p className="text-muted-foreground">
            Upload media to analyze with advanced AI vision
          </p>
        </div>
        
        <div className="space-y-8">
          <Card className="p-6">
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="password"
                  placeholder="Enter Google Cloud Vision API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Save API Key</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your API key will be stored securely in your browser.
              </p>
            </form>
          </Card>
          
          <MediaUpload onFileSelect={handleFileSelect} />
          <ResultDisplay result={result} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;