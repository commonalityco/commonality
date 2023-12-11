import { ConformanceResult } from '@commonalityco/types';
import { Status } from '@commonalityco/utils-core';

export const getStatusForResults = (results: ConformanceResult[]) => {
  let hasFail = false;
  let hasWarn = false;

  for (const result of results) {
    if (result.status === Status.Fail) {
      hasFail = true;
      break;
    } else if (result.status === Status.Warn) {
      hasWarn = true;
    }
  }

  if (hasFail) {
    return Status.Fail;
  } else if (hasWarn) {
    return Status.Warn;
  } else {
    return Status.Pass;
  }
};
