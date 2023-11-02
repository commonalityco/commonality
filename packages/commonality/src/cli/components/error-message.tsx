import React from 'react';
import { Box, Text } from 'ink';

export const ErrorMessage = ({
  error,
  title,
}: {
  error?: Error;
  title: string;
}) => (
  <>
    <Box gap={1}>
      <Text color="red">Error</Text>
      <Text>{title}</Text>
    </Box>
    {error ? (
      <Box flexDirection="column">
        <Text>{String(error.name)}</Text>
        <Text>{String(error.message)}</Text>
      </Box>
    ) : undefined}
  </>
);
