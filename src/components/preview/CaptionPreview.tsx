import React, { useEffect, useRef } from 'react';
import { Card } from '../ui/card';

interface CaptionPreviewProps {
  imageUrl: string;
  caption: string;
}

export const CaptionPreview = ({ imageUrl, caption }: CaptionPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl || !caption || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;

    image.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw image
      ctx.drawImage(image, 0, 0);

      // Configure text style
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      
      // Calculate font size based on image dimensions
      const fontSize = Math.max(image.width * 0.04, 16); // Min 16px
      ctx.font = `${fontSize}px sans-serif`;

      // Word wrap the caption
      const maxWidth = image.width * 0.9;
      const words = caption.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);

      // Draw text
      const lineHeight = fontSize * 1.5;
      const totalTextHeight = lines.length * lineHeight;
      const startY = (image.height - totalTextHeight) * 0.9; // Position at 90% from top

      lines.forEach((line, i) => {
        const y = startY + (i * lineHeight);
        ctx.strokeText(line, image.width / 2, y);
        ctx.fillText(line, image.width / 2, y);
      });
    };
  }, [imageUrl, caption]);

  if (!imageUrl || !caption) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Select a caption to see the preview
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <div className="relative w-full">
        <canvas 
          ref={canvasRef}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </Card>
  );
};