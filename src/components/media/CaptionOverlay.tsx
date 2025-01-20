import React, { useEffect, useRef } from 'react';

interface CaptionOverlayProps {
  imageUrl: string;
  caption: string;
}

export const CaptionOverlay = ({ imageUrl, caption }: CaptionOverlayProps) => {
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
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      
      const fontSize = Math.max(image.width * 0.04, 16);
      ctx.font = `${fontSize}px sans-serif`;

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

      const lineHeight = fontSize * 1.5;
      const totalTextHeight = lines.length * lineHeight;
      const startY = (image.height - totalTextHeight) * 0.9;

      lines.forEach((line, i) => {
        const y = startY + (i * lineHeight);
        ctx.strokeText(line, image.width / 2, y);
        ctx.fillText(line, image.width / 2, y);
      });
    };
  }, [imageUrl, caption]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-auto rounded-lg shadow-lg"
    />
  );
};