export function withTiming<T extends (...arguments_: any[]) => any>(
  name: string,
  function_: T
): (...arguments_: Parameters<T>) => ReturnType<T> {
  return (...arguments_: Parameters<T>): ReturnType<T> => {
    const startTime = Date.now();
    const result = function_(...arguments_);
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log({ seconds: duration.toFixed(2) }, `${name} executed`);

    return result;
  };
}
