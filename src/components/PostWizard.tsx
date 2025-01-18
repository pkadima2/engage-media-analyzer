import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './ui/use-toast';

interface PostWizardProps {
  postId: string;
  onComplete: () => void;
}

type Platform = 'Instagram' | 'LinkedIn' | 'Facebook' | 'Twitter' | 'TikTok';
type Goal = 'Sales' | 'Drive Engagement' | 'Grow Followers' | 'Share Knowledge' | 'Brand Awareness';
type Tone = 'Professional' | 'Casual' | 'Humorous' | 'Persuasive' | 'Inspirational';

export const PostWizard = ({ postId, onComplete }: PostWizardProps) => {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<Platform>();
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState<Goal>();
  const [tone, setTone] = useState<Tone>();

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setStep(prev => Math.min(4, prev + 1));
  };

  const handleComplete = async () => {
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

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</div>
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

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">3</div>
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

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">4</div>
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
          {[1, 2, 3, 4].map((number) => (
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
        
        {step < 4 ? (
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && !platform) ||
              (step === 2 && !niche) ||
              (step === 3 && !goal)
            }
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!tone}
          >
            Analyze Media
          </Button>
        )}
      </div>
    </Card>
  );
};