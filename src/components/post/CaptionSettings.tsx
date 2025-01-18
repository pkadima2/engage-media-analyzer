import React from 'react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface CaptionSettingsProps {
  overlayEnabled: boolean;
  onOverlayChange: (enabled: boolean) => void;
}

export const CaptionSettings = ({ overlayEnabled, onOverlayChange }: CaptionSettingsProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        id="caption-overlay"
        checked={overlayEnabled}
        onCheckedChange={onOverlayChange}
      />
      <Label htmlFor="caption-overlay">Overlay caption on image</Label>
    </div>
  );
};