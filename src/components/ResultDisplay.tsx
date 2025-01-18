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
      <Card className="p-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </Card>
    );
  }

  if (!result) return null;

  const renderValue = (value: any): JSX.Element => {
    if (typeof value === 'object' && value !== null) {
      return (
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(value).map(([key, val]) => (
            <AccordionItem value={key} key={key}>
              <AccordionTrigger className="text-sm hover:no-underline">
                {key}
              </AccordionTrigger>
              <AccordionContent>
                {renderValue(val)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    }
    return <span className="text-sm">{String(value)}</span>;
  };

  return (
    <Card className="p-6 animate-fade-up">
      <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
      {renderValue(result)}
    </Card>
  );
};