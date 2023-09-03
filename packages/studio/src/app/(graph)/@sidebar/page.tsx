import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import StudioSidebar from './studio-sidebar';
import { cookies } from 'next/headers';
import * as z from 'zod';

async function GraphSidebarPage() {
  const [tagsData, codeownersData, packages] = await Promise.all([
    getTagsData(),
    getCodeownersData(),
    getPackagesData(),
  ]);
  const defaultLayoutCookie = cookies().get('commonality:sidebar-layout');

  const getDefaultLayout = () => {
    try {
      if (defaultLayoutCookie) {
        const parsedLayout = JSON.parse(defaultLayoutCookie.value);
        const layoutSchema = z.union([
          z.tuple([z.number(), z.number(), z.number()]),
          z.undefined(),
        ]);
        return layoutSchema.parse(parsedLayout);
      }
    } catch (err) {
      return undefined;
    }
  };

  const defaultLayout = getDefaultLayout();

  return (
    <StudioSidebar
      tagsData={tagsData}
      codeownersData={codeownersData}
      packages={packages}
      defaultLayout={defaultLayout}
    />
  );
}

export default GraphSidebarPage;
