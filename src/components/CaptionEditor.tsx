import React from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Skeleton } from './ui/skeleton';

interface CaptionEditorProps {
  captions: string[];
  onSelect: (caption: string) => void;
  onEdit: (index: number, newCaption: string) => void;
  selectedCaption?: string;
  isLoading?: boolean;
}

export const CaptionEditor = ({
  captions,
  onSelect,
  onEdit,
  selectedCaption,
  isLoading
}: CaptionEditorProps) => {
  const formatCaption = (caption: string) => {
    // Extract title between ** ** if present
    const titleMatch = caption.match(/\*\*(.*?)\*\*/);
    if (titleMatch) {
      const title = titleMatch[1];
      const rest = caption.replace(/\*\*.*?\*\*/, '').trim();
      return (
        <>
          <p className="font-bold text-base mb-2">{`**${title}**`}</p>
          <p>{rest}</p>
        </>
      );
    }
    return caption;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  if (!captions.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No captions generated yet. Please complete the previous steps.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Choose or Edit Caption</h3>
      <RadioGroup
        value={selectedCaption}
        onValueChange={onSelect}
        className="space-y-4"
      >
        {captions.map((caption, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start space-x-2">
              <RadioGroupItem value={caption} id={`caption-${index}`} />
              <Label htmlFor={`caption-${index}`} className="font-medium">
                Option {index + 1}
              </Label>
            </div>
            <Textarea
              value={caption}
              onChange={(e) => onEdit(index, e.target.value)}
              className="min-h-[100px] w-full"
              placeholder="Edit this caption..."
            />
            <div className="mt-2 text-sm text-foreground">
              {formatCaption(caption)}
            </div>
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
};