import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = new URLSearchParams(Array.from(searchParams.entries()));

  const setQuery = (
    key: string,
    value: string | string[],
    options?: { shallow?: boolean },
  ) => {
    if (typeof value === 'string') {
      query.set(key, value);
      router.push(`${pathname}?${query.toString()}`);
    } else if (Array.isArray(value)) {
      query.delete(key);
      for (const item of value) {
        query.append(key, item);
      }

      const newPath = `${pathname}?${query.toString()}`;

      if (options?.shallow) {
        history.replaceState(null, '', newPath);
      } else {
        router.push(newPath, { scroll: false });
      }
    }
  };

  const deleteQuery = (key: string, options?: { shallow?: boolean }) => {
    query.delete(key);

    const newPath = `${pathname}?${query.toString()}`;

    if (options?.shallow) {
      history.replaceState(null, '', newPath);
    } else {
      router.push(newPath, { scroll: false });
    }
  };

  return { query, setQuery, deleteQuery };
};
