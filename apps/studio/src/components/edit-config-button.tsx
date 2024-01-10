'use client';
import { openProjectConfig } from '@/actions/editor';
import { Button, cn } from '@commonalityco/ui-design-system';
import { Settings } from 'lucide-react';

export function EditConfigButton({ className }: { className?: string }) {
  return (
    <Button
      onClick={() => openProjectConfig()}
      className={cn('flex gap-2', className)}
    >
      <Settings className="h-4 w-4" /> Edit config
    </Button>
  );
}
