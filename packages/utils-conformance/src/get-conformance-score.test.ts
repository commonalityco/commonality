import { describe, expect, it } from 'vitest';
import { getConformanceScore } from './get-conformance-score';
import { ConformanceResult } from './get-conformance-results';
import { PackageType, Status } from '@commonalityco/utils-core';

describe('getConformanceScore', () => {
  it('should return 100 for all passing items', () => {
    const items: ConformanceResult[] = [
      {
        id: '1',
        filter: 'filter1',
        package: {
          name: 'package1',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message1' },
        status: Status.Pass,
      },
      {
        id: '2',
        filter: 'filter2',
        package: {
          name: 'package2',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message2' },
        status: Status.Pass,
      },
      {
        id: '3',
        filter: 'filter3',
        package: {
          name: 'package3',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message3' },
        status: Status.Pass,
      },
    ];
    expect(getConformanceScore(items)).toBe(100);
  });

  it('should return 0 for all failing items', () => {
    const items: ConformanceResult[] = [
      {
        id: '1',
        filter: 'filter1',
        package: {
          name: 'package1',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message1' },
        status: Status.Fail,
      },
      {
        id: '2',
        filter: 'filter2',
        package: {
          name: 'package2',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message2' },
        status: Status.Fail,
      },
      {
        id: '3',
        filter: 'filter3',
        package: {
          name: 'package3',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message3' },
        status: Status.Fail,
      },
    ];
    expect(getConformanceScore(items)).toBe(0);
  });

  it('should return 50 for all warning items', () => {
    const items: ConformanceResult[] = [
      {
        id: '1',
        filter: 'filter1',
        package: {
          name: 'package1',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message1' },
        status: Status.Warn,
      },
      {
        id: '2',
        filter: 'filter2',
        package: {
          name: 'package2',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message2' },
        status: Status.Warn,
      },
      {
        id: '3',
        filter: 'filter3',
        package: {
          name: 'package3',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message3' },
        status: Status.Warn,
      },
    ];
    expect(getConformanceScore(items)).toBe(50);
  });

  it('should handle a mix of pass, fail, and warn correctly', () => {
    const items: ConformanceResult[] = [
      {
        id: '1',
        filter: 'filter1',
        package: {
          name: 'package1',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message1' },
        status: Status.Pass,
      },
      {
        id: '2',
        filter: 'filter2',
        package: {
          name: 'package2',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message2' },
        status: Status.Warn,
      },
      {
        id: '3',
        filter: 'filter3',
        package: {
          name: 'package3',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message3' },
        status: Status.Fail,
      },
    ];
    expect(getConformanceScore(items)).toBeCloseTo(50, 0);
  });

  it('should return 0 if no items are provided', () => {
    const items: ConformanceResult[] = [];
    expect(getConformanceScore(items)).toBe(0);
  });

  it('should handle unknown statuses by ignoring them', () => {
    const items: ConformanceResult[] = [
      {
        id: '1',
        filter: 'filter1',
        package: {
          name: 'package1',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message1' },
        status: Status.Pass,
      },
      {
        id: '2',
        filter: 'filter2',
        package: {
          name: 'package2',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message2' },
        status: Status.Pass,
      },
      {
        id: '3',
        filter: 'filter3',
        package: {
          name: 'package3',
          version: '1.0.0',
          type: PackageType.NODE,
          path: '/path',
        },
        message: { message: 'message3' },
        status: Status.Fail,
      },
    ];
    expect(getConformanceScore(items)).toBeCloseTo(66, 1);
  });
});
