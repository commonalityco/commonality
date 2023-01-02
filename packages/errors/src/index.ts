export const UnauthorizedErrorMessage =
  'You are not authorized to perform this action';
export class UnauthorizedError extends Error {
  public name = 'UnauthorizedError';

  constructor() {
    super();

    this.message = UnauthorizedErrorMessage;

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export const InvalidSnapshotErrorMessage =
  'The snapshot you attempted to publish is invalid.' as const;
export class InvalidSnapshotError extends Error {
  public name = 'InvalidSnapshotError';

  constructor() {
    super();

    this.message = InvalidSnapshotErrorMessage;

    Object.setPrototypeOf(this, InvalidSnapshotError.prototype);
  }
}

export const GenericErrorMessage = 'Failed to publish snapshot' as const;
export class GenericError extends Error {
  public errorName = 'GenericError';

  constructor() {
    super();

    this.message = GenericErrorMessage;

    Object.setPrototypeOf(this, GenericError.prototype);
  }
}
