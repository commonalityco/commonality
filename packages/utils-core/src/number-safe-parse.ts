export function numberSafeParse(input?: string): number | void {
  if (!input) return;

  if (input.trim() === '') return;

  const parsed = Number(input);

  if (!Number.isFinite(parsed)) return;

  return parsed;
}
