import './globals.css';
import type { AppProps } from 'next/app';
import { Inter, Fira_Code } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${inter.className} ${firaCode.variable} ${inter.variable}`}
    >
      <Component {...pageProps} />
    </div>
  );
}
