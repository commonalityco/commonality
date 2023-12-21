import './globals.css';
import { Vollkorn, Inter } from 'next/font/google';
import { cn } from '@commonalityco/ui-design-system';

export const vollkorn = Vollkorn({
  subsets: ['latin'],
  variable: '--font-vollkorn',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={cn(inter.className, inter.variable, vollkorn.variable)}>
      <Component {...pageProps} />
    </div>
  );
}
