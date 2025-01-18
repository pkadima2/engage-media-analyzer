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
            Environment & Setting
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Setting Type</h4>
              <ul className="space-y-1">
                {result.environment.setting.labels.map((label: any, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{label.description}</span>
                    <span className="text-muted-foreground">{label.confidence}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Notable Elements</h4>
              <ul className="space-y-1">
                {result.environment.setting.elements.map((element: any, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{element.description}</span>
                    <span className="text-muted-foreground">{element.confidence}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ambiance">
          <AccordionTrigger className="text-base hover:no-underline">
            Ambiance & Atmosphere
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Lighting</h4>
              <p className="capitalize">{result.environment.ambiance.lighting}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Color Scheme</h4>
              <div className="space-y-2">
                {result.environment.ambiance.colors.map((color: any, index: number) => (
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
            Context & Notable Elements
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
            {result.context.text && (
              <div>
                <h4 className="font-medium mb-2">Detected Text</h4>
                <p className="text-sm">{result.context.text}</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="human">
          <AccordionTrigger className="text-base hover:no-underline">
            Human Interaction
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">People Present</h4>
              <p>{result.humanInteraction.peoplePresent ? "Yes" : "No"}</p>
            </div>
            {result.humanInteraction.faces.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Facial Expressions</h4>
                {result.humanInteraction.faces.map((face: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <p>Face {index + 1}:</p>
                    <ul className="ml-4">
                      {Object.entries(face).map(([key, value]: [string, string]) => (
                        <li key={key} className="capitalize">
                          {key}: {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="theme">
          <AccordionTrigger className="text-base hover:no-underline">
            Overall Theme & Safety
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Detected Mood</h4>
              <p className="capitalize">{result.overallTheme.mood}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Content Safety</h4>
              <ul className="space-y-1">
                {Object.entries(result.overallTheme.safety).map(([key, value]: [string, string]) => (
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