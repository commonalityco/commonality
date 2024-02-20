import { getConstraintsData } from '@/data/constraints';
import { GraphHeader } from '@commonalityco/ui-constraints';
import React from 'react';

async function StudioGraphHeader() {
  const results = await getConstraintsData();

  return <GraphHeader results={results} />;
}

export default StudioGraphHeader;
