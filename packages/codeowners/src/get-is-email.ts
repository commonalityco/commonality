const emailRegex =
  /^[-!#$%&'*+/\w=?^`{|}~](\.?[-!#$%&'*+/\w=?^`{|}~])*@[a-zA-Z\d](-*\.?[a-zA-Z\d])*\.[a-zA-Z](-?[a-zA-Z\d])+$/;

export const getIsEmail = (owner: string) => emailRegex.test(owner);
