import React from 'react';

interface CaptionTitleProps {
  title: string;
}

export const CaptionTitle = ({ title }: CaptionTitleProps) => {
  return (
    <p className="font-bold text-base mb-2 text-primary">
      {title}
    </p>
  );
};