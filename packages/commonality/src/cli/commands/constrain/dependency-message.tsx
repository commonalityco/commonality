import { Constraint, Package, Violation } from '@commonalityco/types';
import { DependencyType, formatTagName } from '@commonalityco/utils-core';
import { Box, Text } from 'ink';
import React from 'react';

export function DependencyMessage({
  isValid,
  violation,
  constraint,
  targetPkg,
  type,
  filter,
}: {
  isValid: boolean;
  type: DependencyType;
  targetPkg: Package;
  filter: string;
  constraint: Constraint;
  violation?: Violation;
}) {
  const color = isValid ? 'green' : 'red';
  const width = 'disallow' in constraint ? 11 : 8;

  return (
    <Box flexDirection="column" paddingBottom={1}>
      <Box alignItems="center" gap={1}>
        <Text color={color} inverse bold>
          {isValid ? ' PASS ' : ' FAIL '}
        </Text>
        <Box>
          <Text color={color}>
            {filter === '*' ? 'All packages' : formatTagName(filter)}
          </Text>
        </Box>

        <Text color={color}>-→</Text>

        <Text color={color}>{targetPkg.name}</Text>
        <Text dimColor>{`${type}`}</Text>
      </Box>
      {violation?.found ? (
        <Box paddingLeft={7} paddingBottom={1}>
          <Text dimColor>{`${targetPkg.path}/commonality.json`}</Text>
        </Box>
      ) : undefined}
      <Box paddingLeft={7} flexDirection="column">
        {'allow' in constraint ? (
          <Box gap={1}>
            <Box width={width}>
              <Text dimColor>Allowed:</Text>
            </Box>
            <Text dimColor>
              {constraint.allow === '*'
                ? 'All packages'
                : constraint.allow.map((tag) => formatTagName(tag))}
            </Text>
          </Box>
        ) : undefined}
        {'disallow' in constraint ? (
          <Box gap={1}>
            <Box width={width}>
              <Text dimColor>Disallowed:</Text>
            </Box>
            <Text dimColor>
              {constraint.disallow === '*'
                ? 'All packages'
                : constraint.disallow.map((tag) => formatTagName(tag))}
            </Text>
          </Box>
        ) : undefined}
        {violation?.found ? (
          <Box gap={1}>
            <Box width={width}>
              <Text color={color}>Found:</Text>
            </Box>
            <Text color={color}>
              {violation.found
                ? violation.found.map((tag) => formatTagName(tag))
                : 'No tags'}
            </Text>
          </Box>
        ) : undefined}
      </Box>
    </Box>
  );
}
