import { formatRelative } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import debounce from 'lodash/debounce';

function LastUpdateTime() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const createSocketConnection = async () => {
      const socket = io();

      socket.on('connect', () => {
        console.log('Watching for updates...');
      });

      socket.on(
        'project-updated',
        debounce(() => {
          console.log('project updated');
          router.refresh();

          setLastUpdated(new Date());
        }, 500),
      );
      socket.on('disconnect', () => {
        console.log('Stopped watching for updates...');
      });
    };

    createSocketConnection();
  }, [router]);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);

      if (count > 60) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [count]);

  return (
    <div className="text-muted-foreground text-xs animate-in fade-in">
      {`Last updated ${formatRelative(new Date(), lastUpdated)}`}
    </div>
  );
}

export default LastUpdateTime;
