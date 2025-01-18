import React from 'react';
import { Card } from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface ResultDisplayProps {
  result: any;
  isLoading: boolean;
}

export const ResultDisplay = ({ result, isLoading }: ResultDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
        </div>
      </Card>
    );
  }

  if (!result) return null;

  const renderColorBox = (color: string) => (
    <div className="flex items-center gap-2">
      <div 
        className="w-6 h-6 rounded border border-border"
        style={{ backgroundColor: color }}
      />
      <span>{color}</span>
    </div>
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem value="environment">
          <AccordionTrigger className="text-base hover:no-underline">
            Environment & Scene
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Labels</h4>
              <ul className="space-y-1">
                {result.environment.labels.map((label: any, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{label.description}</span>
                    <span className="text-muted-foreground">{label.confidence}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Dominant Colors</h4>
              <div className="space-y-2">
                {result.environment.colors.map((color: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    {renderColorBox(color.rgb)}
                    <span className="text-muted-foreground">{color.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="context">
          <AccordionTrigger className="text-base hover:no-underline">
            Context & Objects
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Detected Objects</h4>
              <ul className="space-y-1">
                {result.context.objects.map((obj: any, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{obj.name}</span>
                    <span className="text-muted-foreground">{obj.confidence}</span>
                  </li>
                ))}
              </ul>
            </div>
            {result.context.landmarks.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Landmarks</h4>
                <ul className="space-y-1">
                  {result.context.landmarks.map((landmark: any, index: number) => (
                    <li key={index} className="flex justify-between">
                      <span>{landmark.name}</span>
                      <span className="text-muted-foreground">{landmark.confidence}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mood">
          <AccordionTrigger className="text-base hover:no-underline">
            Mood & Emotions
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {result.mood.faces.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Facial Expressions</h4>
                {result.mood.faces.map((face: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <p>Face {index + 1}:</p>
                    <ul className="ml-4">
                      <li>Joy: {face.joy}</li>
                      <li>Sorrow: {face.sorrow}</li>
                      <li>Anger: {face.anger}</li>
                      <li>Surprise: {face.surprise}</li>
                    </ul>
                  </div>
                ))}
              </div>
            )}
            <div>
              <h4 className="font-medium mb-2">Content Safety</h4>
              <ul className="space-y-1">
                {Object.entries(result.mood.safety).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};