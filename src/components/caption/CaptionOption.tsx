import React from 'react';
import { RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { CaptionTitle } from './CaptionTitle';
import { CaptionContent } from './CaptionContent';

interface CaptionOptionProps {
  index: number;
  caption: string;
  onEdit: (newCaption: string) => void;
}

export const CaptionOption = ({ index, caption, onEdit }: CaptionOptionProps) => {
  const formatCaption = (caption: string) => {
    const titleMatch = caption.match(/\*\*(.*?)\*\*/);
    if (titleMatch) {
      const title = titleMatch[1];
      const rest = caption.replace(/\*\*.*?\*\*/, '').trim();
      return { title, content: rest };
    }
    return { content: caption };
  };

  const { title, content } = formatCaption(caption);

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <RadioGroupItem value={caption} id={`caption-${index}`} />
        <Label htmlFor={`caption-${index}`} className="font-medium">
          Option {index + 1}
        </Label>
      </div>
      <Textarea
        value={caption}
        onChange={(e) => onEdit(e.target.value)}
        className="min-h-[100px] w-full"
        placeholder="Edit this caption..."
      />
      <div className="mt-2 text-sm">
        {title && <CaptionTitle title={title} />}
        <CaptionContent content={content} />
      </div>
    </div>
  );
};