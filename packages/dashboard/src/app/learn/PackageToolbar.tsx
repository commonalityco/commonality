'use client';
import { Package } from '@commonalityco/types';
import { IconButton } from '@commonalityco/ui-icon-button';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import * as Tooltip from '@commonalityco/ui-tooltip';

function PackageToolbar({ pkg }: { pkg?: Package }) {
  const onEditorClick = async () => {
    if (!pkg) return;

    const url = '/api/editor';
    const data = { path: pkg.path };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log(jsonResponse);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton size="sm" use="ghost" onClick={onEditorClick}>
            <CodeBracketIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Open in editor</Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}

export default PackageToolbar;
