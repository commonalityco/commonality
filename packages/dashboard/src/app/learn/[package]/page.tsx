import { getPackageDocumentationData } from 'data/documentation';
import MarkdownPanel from 'app/learn/MarkdownPanel';
import PackageDetailsPanel from 'app/learn/PackageDetailsPanel';
import { getPackagesData } from 'data/packages';
import { slugifyPackageName } from 'utils/slugify-package-name';
import PackageToolbar from 'app/learn/PackageToolbar';
import PackageHeader from 'app/learn/PackageHeader';

interface PackagePageProps {
  params: {
    package: string;
  };
}

async function PackagePage({ params }: PackagePageProps) {
  const documentationData = await getPackageDocumentationData();
  const packages = await getPackagesData();

  const pkg = packages.find(
    (pkg) => slugifyPackageName(pkg.name) === params.package
  );

  const documentation = pkg ? documentationData[pkg.name] : undefined;

  if (!pkg) return <div>Package not found</div>;

  return (
    <>
      <PackageHeader pkg={pkg}>
        <PackageToolbar pkg={pkg} />
      </PackageHeader>
      <div className="flex grow flex-nowrap overflow-hidden">
        <MarkdownPanel docs={documentation ?? []} pkg={pkg} />
        <PackageDetailsPanel pkg={pkg} />
      </div>
    </>
  );
}

export default PackagePage;
