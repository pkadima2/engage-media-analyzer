import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface PostStepsProps {
  step: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  isNextDisabled: boolean;
  children: React.ReactNode;
}

export const PostSteps = ({ 
  step, 
  onBack, 
  onNext, 
  onComplete, 
  isNextDisabled, 
  children 
}: PostStepsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((number) => (
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

      {children}

      <div className="flex justify-between mt-8">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={step === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        {step < 6 ? (
          <Button onClick={onNext} disabled={isNextDisabled}>
            Next
          </Button>
        ) : (
          <Button onClick={onComplete} disabled={isNextDisabled}>
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};