import React from 'react';
import { Package } from '@commonalityco/types';
import { Box, Text } from 'ink';

export const MessagePackageTitle = ({
  verbose,
  result,
  pkg,
  countMessage,
}: {
  verbose: boolean;
  result: 'pass' | 'fail';
  countMessage: string;
  pkg: Package;
}) => {
  const isExpanded = result === 'fail' || verbose;

  return (
    <Box flexDirection="column">
      <Box gap={1}>
        {isExpanded ? (
          <Text color="yellow">❯</Text>
        ) : (
          <Text color="green">✓</Text>
        )}
        <Text dimColor={!isExpanded} underline={isExpanded}>
          {pkg.name}
        </Text>
        <Text dimColor>{countMessage}</Text>
      </Box>
      {isExpanded && result === 'fail' ? (
        <Box paddingLeft={2} paddingBottom={1}>
          <Text dimColor>{`${pkg.path}/commonality.json`}</Text>
        </Box>
      ) : undefined}
    </Box>
  );
};
