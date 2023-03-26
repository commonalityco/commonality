import { getRootDocumentationData } from 'data/documentation';
import MarkdownPanel from 'app/learn/MarkdownPanel';
import PackageDetailsPanel from 'app/learn/PackageDetailsPanel';
import { getRootPackageData } from 'data/packages';
import PackageToolbar from 'app/learn/PackageToolbar';
import PackageHeader from 'app/learn/PackageHeader';

export const revalidate = 360000;

async function LearnPage() {
  const rootDocs = await getRootDocumentationData();
  const rootPkg = await getRootPackageData();

  return (
    <>
      <PackageHeader pkg={rootPkg}>
        <PackageToolbar pkg={rootPkg} />
      </PackageHeader>
      <div className="flex flex-nowrap">
        <MarkdownPanel pkg={rootPkg} docs={rootDocs} />
        <PackageDetailsPanel pkg={rootPkg} />
      </div>
    </>
  );
}

export default LearnPage;
