import { OnSelectionChangeParams } from '@xyflow/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import queryString from 'query-string';
import { compressToEncodedURIComponent } from 'lz-string';

export const useOnInteraction = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      router.push(
        pathname +
          '?' +
          queryString.stringify({
            ...Object.fromEntries(searchParams),
            packages: compressToEncodedURIComponent(
              JSON.stringify(nodes.map((node) => node.id)),
            ),
          }),
      );
    },
    [pathname, router, searchParams],
  );
};
