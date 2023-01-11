// Import treeverse from 'treeverse';
// import type {
// 	Config,
// 	LocalPackage,
// 	LocalViolation,
// } from '@commonalityco/types';
// import intersection from 'lodash.intersection';

// export const getConstraintViolations = (
// 	packages: LocalPackage[],
// 	config: Config
// ): LocalViolation[] => {
// 	const violations: LocalViolation[] = [];

// 	for (const constraint of config?.constraints || []) {
// 		const packagesWithConstraint = packages.filter((pkg) =>
// 			intersection(pkg.tags, constraint.tags)
// 		);

// 		for (const packageWithConstraint of packagesWithConstraint) {
// 			treeverse.depth({
// 				tree: packageWithConstraint,
// 				leave(node: {
// 					name: string;
// 					path: string;
// 					children: Array<typeof packageWithConstraint>;
// 				}) {
// 					if (node.children.length === 0) {
// 						return;
// 					}

// 					for (const child of node.children) {
// 						if (intersection(child.tags, constraint.allow).length > 0) {
// 							continue;
// 						} else {
// 							violations.push({
// 								path: node.path,
// 								sourceName: node.name,
// 								targetName: child.name,
// 								constraintTags: constraint.tags || [],
// 								allowedTags: constraint.allow || [],
// 								targetTags: child.tags,
// 							});
// 						}
// 					}
// 				},
// 				visit(node: typeof packageWithConstraint) {
// 					const dependencyNames = node.dependencies.map((dep) => dep.name);
// 					const devDependencyNames = node.devDependencies.map(
// 						(dep) => dep.name
// 					);
// 					const peerDependencyNames = node.peerDependencies.map(
// 						(dep) => dep.name
// 					);

// 					const allDependencyNames = new Set([
// 						...dependencyNames,
// 						...devDependencyNames,
// 						...peerDependencyNames,
// 					]);

// 					const children = packages.filter((pkg) =>
// 						allDependencyNames.has(pkg.name)
// 					);

// 					return { name: node.name, children, path: node.path };
// 				},
// 				getChildren(node: { children: Array<typeof packageWithConstraint> }) {
// 					return node.children;
// 				},
// 			});
// 		}
// 	}

// 	return violations;
// };
