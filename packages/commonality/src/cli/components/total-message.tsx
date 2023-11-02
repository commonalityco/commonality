import React from 'react';
import { Box, Text } from 'ink';

export const TotalMessage = ({
  title,
  totalCount,
  passCount,
  failCount,
}: {
  title: string;
  totalCount: number;
  passCount: number;
  failCount: number;
}) => {
  return (
    <Box gap={1}>
      <Text bold>{title}</Text>
      <Text
        color={failCount > 0 ? 'red' : undefined}
        dimColor={failCount === 0}
      >{`${failCount} failed`}</Text>
      <Text
        color={passCount > 0 ? 'green' : undefined}
        dimColor={passCount === 0}
      >{`${passCount} passed`}</Text>
      <Text dimColor>{`(${totalCount})`}</Text>
    </Box>
  );
};
