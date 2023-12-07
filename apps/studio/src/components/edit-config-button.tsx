'use client';
import { openProjectConfig } from '@/actions/editor';
import { Button } from '@commonalityco/ui-design-system';
import { Settings } from 'lucide-react';

export function EditConfigButton() {
  return (
    <Button onClick={() => openProjectConfig()} className="flex gap-2">
      <Settings className="h-4 w-4" /> Edit config
    </Button>
  );
}
