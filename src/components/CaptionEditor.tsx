import React from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

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
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-20 bg-muted rounded animate-pulse" />
          <div className="h-20 bg-muted rounded animate-pulse" />
          <div className="h-20 bg-muted rounded animate-pulse" />
        </div>
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
              className="min-h-[100px]"
            />
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
};