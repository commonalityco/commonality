import { SingularData } from 'cytoscape';

export const darkModeNamespace = 'COMMONALITY_DARK_MODE';

export const getIsDarkMode = (element: SingularData) => {
  return element.scratch(darkModeNamespace) === true;
};
