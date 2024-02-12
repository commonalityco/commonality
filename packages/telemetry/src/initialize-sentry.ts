import * as Sentry from '@sentry/node';

export function initializeTelemetry({ release }: { release: string }): void {
  Sentry.init({
    dsn: 'https://e9c4356b7d696b95007ea2dc6bb6264a@o99301.ingest.sentry.io/4506735868510208',

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
}
