import { ThemeName } from 'constants/ThemeName';

interface CytoscapeNodeHtmlParams {
  query?: string;
  halign?: IHAlign;
  valign?: IVAlign;
  halignBox?: IHAlign;
  valignBox?: IVAlign;
  cssClass?: string;
  tpl?: (d: any) => string;
}

declare global {
  interface Window {
    COMMONALITY_THEME: ThemeName.Dark | ThemeName.Light;
  }

  namespace cytoscape {
    interface Core {
      nodeHtmlLabel: (els: CytoscapeNodeHtmlParams[]) => void;
    }
  }
}
