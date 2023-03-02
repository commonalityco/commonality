declare type IHAlign = 'left' | 'center' | 'right';
declare type IVAlign = 'top' | 'center' | 'bottom';

interface CytoscapeNodeHtmlParams {
  query?: string;
  halign?: IHAlign;
  valign?: IVAlign;
  halignBox?: IHAlign;
  valignBox?: IVAlign;
  cssClass?: string;
  tpl?: (d: any) => string;
}

interface CytoscapeContainerParams {
  enablePointerEvents?: boolean;
}

declare module 'cytoscape-node-html-label' {
  const init: (cytoscape: any) => void;

  export default init;
}
