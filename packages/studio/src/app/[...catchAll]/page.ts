import { redirect } from 'next/navigation';

function CatchAllPage() {
  redirect('/');
}

export default CatchAllPage;
