import MarkdownPanel from 'app/learn/MarkdownPanel';
import PackageDetailsPanel from 'app/learn/PackageDetailsPanel';
import Sidebar from 'app/learn/Sidebar';
import { getPackagesData } from 'data/packages';
import { getProjectConfigData } from 'data/structure';
import { sortBy } from 'lodash';

interface LearnLayoutProps {
  children: React.ReactNode;
}

export const revalidate = 360000;

async function LearnLayout({ children }: LearnLayoutProps) {
  const packages = await getPackagesData();
  const alphabetizedPackages = sortBy(packages, 'name');
  const projectConfig = await getProjectConfigData();

  return (
    <div className="flex grow gap-3 overflow-hidden bg-zinc-100 p-3 dark:bg-zinc-800">
      <Sidebar
        packages={alphabetizedPackages}
        stripScopeFromPackageNames={
          projectConfig?.stripScopeFromPackageNames ?? true
        }
      />
      <div className="grow overflow-hidden">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-white dark:bg-zinc-900">
          {children}
        </div>
      </div>
    </div>
  );
}

export default LearnLayout;
