import 'styled-components';
import type { Theme } from '@commonalityco/ui-theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
