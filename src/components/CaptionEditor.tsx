import React from 'react';
import { Card } from './ui/card';
import { RadioGroup } from './ui/radio-group';
import { Skeleton } from './ui/skeleton';
import { CaptionOption } from './caption/CaptionOption';

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
          <CaptionOption
            key={index}
            index={index}
            caption={caption}
            onEdit={(newCaption) => onEdit(index, newCaption)}
          />
        ))}
      </RadioGroup>
    </Card>
  );
};