import { logger } from 'utils/logger';

export function withTiming<T extends (...args: any[]) => any>(
  name: string,
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const startTime = new Date().getTime();
    const result = fn(...args);
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;

    logger.info({ seconds: duration.toFixed(2) }, `${name} executed`);

    return result;
  };
}
