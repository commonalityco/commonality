import { getDocumentation } from '@commonalityco/snapshot';
import { Heading } from '@commonalityco/ui-heading';
import Sidebar from 'app/learn/Sidebar';
import { getPackagesData } from 'data/packages';
import { getProjectConfigData } from 'data/structure';
import { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';

async function LearnPage() {
  const documentation = await getDocumentation();
  const packages = await getPackagesData();

  const projectConfig = await getProjectConfigData();

  const packageNames = Object.keys(documentation);

  return (
    <div className="flex shrink overflow-hidden">
      <Sidebar
        packages={packages}
        stripScopeFromPackageNames={projectConfig?.constraints}
      />
      <div className="text-white">
        {packageNames.map((pkgName) => {
          const readme = documentation[pkgName].readme;
          if (!readme) {
            return null;
          }

          return (
            <Fragment key={pkgName}>
              <Heading>{pkgName}</Heading>
              <ReactMarkdown key={pkgName}>{readme}</ReactMarkdown>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default LearnPage;
