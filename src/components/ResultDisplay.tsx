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
      <h3 className="text-lg font-semibold mb-4">Image Analysis</h3>
      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem value="summary">
          <AccordionTrigger className="text-base hover:no-underline">
            Quick Summary
          </AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">{result.generalDescription.mainScene.description}</p>
            {result.generalDescription.setting.length > 0 && (
              <p className="text-muted-foreground">
                Setting: {result.generalDescription.setting[0].description}
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="key-elements">
          <AccordionTrigger className="text-base hover:no-underline">
            Key Elements
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {result.sceneElements.objects.slice(0, 5).map((obj: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{obj.name}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger className="text-base hover:no-underline">
            Color Palette
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {result.visualContext.colors.slice(0, 4).map((color: any, index: number) => (
                <div key={index}>
                  {renderColorBox(color.rgb)}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {result.peoplePresent.detected && (
          <AccordionItem value="people">
            <AccordionTrigger className="text-base hover:no-underline">
              People
            </AccordionTrigger>
            <AccordionContent>
              <p>Number of people detected: {result.peoplePresent.faces.length}</p>
              {result.peoplePresent.faces.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Main expressions: {
                      result.peoplePresent.faces[0].joy !== 'VERY_UNLIKELY' ? 'Joy' :
                      result.peoplePresent.faces[0].surprise !== 'VERY_UNLIKELY' ? 'Surprise' :
                      'Neutral'
                    }
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </Card>
  );
};