import * as Sentry from '@sentry/node';
import { nanoid } from 'nanoid';
import { configStore } from './config-store';

const UNIQUE_ID_KEY = 'id';

const setUser = () => {
  const currentUser = configStore.get(UNIQUE_ID_KEY);

  if (currentUser) {
    Sentry.setUser({ id: String(currentUser) });
  }

  const newId = nanoid();

  Sentry.setUser({ id: newId });

  configStore.set(UNIQUE_ID_KEY, newId);
};

export function initializeTelemetry({ release }: { release: string }): void {
  Sentry.init({
    dsn: 'https://8a8e8495f94ba1a11cfdc8264b2c3695@o503511.ingest.sentry.io/4506736521117696',

    tracesSampleRate: 1,
    sampleRate: 1,

    release,

    beforeSendTransaction: (event) => {
      delete event.server_name; // Server name might contain PII
      return event;
    },

    beforeSend: (event) => {
      if (event.exception?.values) {
        for (const exception of event.exception.values) {
          delete exception.stacktrace;
        }
      }

      delete event.server_name;

      return event;
    },
  });

  Sentry.setTag('node', process.version);
  Sentry.setTag('platform', process.platform);

  setUser();
}
