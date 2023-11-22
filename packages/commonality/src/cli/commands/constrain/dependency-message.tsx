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
    <Box flexDirection="column">
      <Box alignItems="center" gap={1}>
        <Text color={color}>{isValid ? '↳ pass' : '↳ fail'}</Text>
        <Box>
          <Text>{filter === '*' ? 'All packages' : formatTagName(filter)}</Text>
        </Box>

        <Text bold color={color}>
          →
        </Text>

        <Text>{targetPkg.name}</Text>
        <Text dimColor>{`${type}`}</Text>
      </Box>
      <Box
        borderDimColor
        borderTop={false}
        borderRight={false}
        borderBottom={false}
        borderStyle="single"
        flexDirection="column"
        paddingBottom={1}
      >
        {violation?.found ? (
          <Box paddingLeft={6}>
            <Text dimColor>{`${targetPkg.path}/commonality.json`}</Text>
          </Box>
        ) : undefined}
        <Box paddingLeft={6} flexDirection="column">
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
    </Box>
  );
}
