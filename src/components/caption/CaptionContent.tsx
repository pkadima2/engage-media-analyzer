import React from 'react';

interface CaptionContentProps {
  content: string;
}

export const CaptionContent = ({ content }: CaptionContentProps) => {
  return (
    <p className="text-foreground whitespace-pre-wrap">
      {content}
    </p>
  );
};