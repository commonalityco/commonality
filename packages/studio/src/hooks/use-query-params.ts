import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = new URLSearchParams(Array.from(searchParams.entries()));

  const setQuery = (key: string, value: string | string[]) => {
    if (typeof value === 'string') {
      query.set(key, value);
      router.push(`${pathname}?${query.toString()}`);
    } else if (Array.isArray(value)) {
      query.delete(key);
      for (const item of value) {
        query.append(key, item);
      }
      router.push(`${pathname}?${query.toString()}`);
    }
  };

  const deleteQuery = (key: string) => {
    query.delete(key);
    router.push(`${pathname}?${query.toString()}`);
  };

  return { query, setQuery, deleteQuery };
};
