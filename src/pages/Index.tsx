import React, { useState } from 'react';
import { MediaUpload } from '@/components/MediaUpload';
import { ResultDisplay } from '@/components/ResultDisplay';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      // Here we'll implement the Google Cloud Vision API call
      // For now, we'll just simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult({ message: "Analysis complete", file: file.name });
      toast({
        title: "Analysis Complete",
        description: "Your media has been successfully analyzed.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your media.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <MediaUpload onFileSelect={handleFileSelect} />
          <ResultDisplay result={result} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;