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
      // Here we'll implement the actual API call later
      // For now, just simulate a response
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