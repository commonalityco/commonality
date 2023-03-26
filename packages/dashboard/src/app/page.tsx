import { redirect } from 'next/navigation';

export const revalidate = 360000;

export default async function Home() {
  redirect('/graph');
}
