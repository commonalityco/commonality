export const getIsTeam = (owner: string) => {
  return owner.charAt(0) === '@';
};
