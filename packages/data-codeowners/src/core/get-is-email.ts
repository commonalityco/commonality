const emailRegex =
  /^[\w!#$%&'*+/=?^`{|}~-](\.?[\w!#$%&'*+/=?^`{|}~-])*@[\dA-Za-z](-*\.?[\dA-Za-z])*\.[A-Za-z](-?[\dA-Za-z])+$/;

export const getIsEmail = (owner: unknown) => {
  if (typeof owner !== 'string') {
    return false;
  }

  return emailRegex.test(owner);
};
