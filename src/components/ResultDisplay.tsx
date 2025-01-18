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
      <h3 className="text-lg font-semibold mb-4">Scene Analysis</h3>
      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem value="general">
          <AccordionTrigger className="text-base hover:no-underline">
            General Description
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Main Scene</h4>
              <p>{result.generalDescription.mainScene.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Confidence: {result.generalDescription.mainScene.confidence}
              </p>
            </div>
            {result.generalDescription.setting.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Setting</h4>
                <ul className="space-y-1">
                  {result.generalDescription.setting.map((item: any, index: number) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.description}</span>
                      <span className="text-muted-foreground">{item.confidence}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="elements">
          <AccordionTrigger className="text-base hover:no-underline">
            Scene Elements
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Detected Objects</h4>
              <ul className="space-y-1">
                {result.sceneElements.objects.map((obj: any, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{obj.name}</span>
                    <span className="text-muted-foreground">{obj.confidence}</span>
                  </li>
                ))}
              </ul>
            </div>
            {result.sceneElements.landmarks.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Landmarks</h4>
                <ul className="space-y-1">
                  {result.sceneElements.landmarks.map((landmark: any, index: number) => (
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

        <AccordionItem value="visual">
          <AccordionTrigger className="text-base hover:no-underline">
            Visual Context
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Color Scheme</h4>
              <div className="space-y-2">
                {result.visualContext.colors.map((color: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    {renderColorBox(color.rgb)}
                    <span className="text-muted-foreground">{color.score}</span>
                  </div>
                ))}
              </div>
            </div>
            {result.visualContext.text && (
              <div>
                <h4 className="font-medium mb-2">Detected Text</h4>
                <p className="text-sm">{result.visualContext.text}</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="people">
          <AccordionTrigger className="text-base hover:no-underline">
            People in Scene
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">People Present</h4>
              <p>{result.peoplePresent.detected ? "Yes" : "No"}</p>
            </div>
            {result.peoplePresent.faces.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Facial Expressions</h4>
                {result.peoplePresent.faces.map((face: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <p>Person {index + 1}:</p>
                    <ul className="ml-4">
                      {Object.entries(face).map(([key, value]: [string, any]) => (
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

        <AccordionItem value="safety">
          <AccordionTrigger className="text-base hover:no-underline">
            Content Safety
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1">
              {Object.entries(result.contentSafety).map(([key, value]: [string, any]) => (
                <li key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace('_', ' ')}</span>
                  <span className="text-muted-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};