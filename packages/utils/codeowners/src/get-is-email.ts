const emailRegex =
  /^[\w!#$%&'*+/=?^`{|}~-](\.?[\w!#$%&'*+/=?^`{|}~-])*@[\dA-Za-z](-*\.?[\dA-Za-z])*\.[A-Za-z](-?[\dA-Za-z])+$/;

export const getIsEmail = (owner: string) => emailRegex.test(owner);
