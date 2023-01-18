import treeverse from 'treeverse';
import type { ProjectConfig, Package, Violation } from '@commonalityco/types';
import intersection from 'lodash.intersection';

export const getConstraintViolations = ({
	packages,
	config,
}: {
	packages: Package[];
	config: ProjectConfig;
}): Violation[] => {
	const violationsByPackageName = new Map<string, Violation[]>();

	for (const constraint of config?.constraints ?? []) {
		const packagesWithConstraint = packages.filter(
			(pkg) => intersection(pkg.tags, constraint.tags).length > 0
		);

		for (const packageWithConstraint of packagesWithConstraint) {
			treeverse.breadth<Package>({
				tree: packageWithConstraint,
				visit(node) {
					return node;
				},
				getChildren(node) {
					const dependencyNames = node.dependencies.map((dep) => dep.name);
					const devDependencyNames = node.devDependencies.map(
						(dep) => dep.name
					);
					const peerDependencyNames = node.peerDependencies.map(
						(dep) => dep.name
					);
					const allDependencyNames = new Set([
						...dependencyNames,
						...devDependencyNames,
						...peerDependencyNames,
					]);
					const dependencies = packages.filter((pkg) =>
						allDependencyNames.has(pkg.name)
					);

					const packageViolations: Violation[] = [];

					for (const dependency of dependencies) {
						const hasDisallowedTag =
							intersection(dependency.tags, constraint.allow).length > 0;

						if (hasDisallowedTag) {
							continue;
						} else {
							packageViolations.push({
								path: node.path,
								sourceName: node.name,
								targetName: dependency.name,
								constraintTags: constraint.tags || [],
								allowedTags: constraint.allow || [],
								targetTags: dependency.tags,
							});
						}
					}

					violationsByPackageName.set(node.name, packageViolations);

					return dependencies;
				},
			});
		}
	}

	const violations = Array.from(violationsByPackageName.values()).flat();

	return violations;
};
