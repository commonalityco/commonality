declare module 'x-default-browser' {
  type Browser =
    | 'safari'
    | 'firefox'
    | 'chrome'
    | 'chromium'
    | 'opera'
    | 'unknown';

  interface Result {
    commonName: Browser;
  }

  type DefaultBrowserCallback = (error: string | null, result: Result) => void;

  function getDefaultBrowser(callback: DefaultBrowserCallback): void;

  export default getDefaultBrowser;
}
