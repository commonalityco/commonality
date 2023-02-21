import { Graph } from './Graph';
import { getElements } from '@/data/graph';

export default async function Home() {
  const graphLayout = await getElements();

  return (
    <main style={{ height: 'calc(100% - 56px)' }}>
      <Graph elements={graphLayout} />
    </main>
  );
}
