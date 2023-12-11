'use server';
import { EditConfigButton } from '@/components/edit-config-button';
import { getConstraintsData } from '@/data/constraints';
import { FeatureGraphHeader } from '@commonalityco/feature-constraints/components';
import React from 'react';

async function StudioGraphHeader() {
  const results = await getConstraintsData();

  return (
    <FeatureGraphHeader results={results}>
      <EditConfigButton />
    </FeatureGraphHeader>
  );
}

export default StudioGraphHeader;
