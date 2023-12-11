'use client'; // Error components must be Client Components

import { Button } from '@commonalityco/ui-design-system';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="grow w-full flex items-center justify-center">
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-semibold">Oops</h2>
        <p>Something has gone wrong</p>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
