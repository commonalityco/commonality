import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

function CatchAllPage() {
  return redirect('/');
}

export default CatchAllPage;
