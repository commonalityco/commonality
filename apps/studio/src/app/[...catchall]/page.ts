import { redirect } from 'next/navigation';

function CatchAllPage() {
  redirect('/graph');
}

export default CatchAllPage;
