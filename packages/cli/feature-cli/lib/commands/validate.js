'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.validate = void 0;
const data_project_1 = require('@commonalityco/data-project');
const data_packages_1 = require('@commonalityco/data-packages');
const data_tags_1 = require('@commonalityco/data-tags');
const commander_1 = require('commander');
const data_violations_1 = require('@commonalityco/data-violations');
const chalk_1 = __importDefault(require('chalk'));
const terminal_link_1 = __importDefault(require('terminal-link'));
const node_path_1 = __importDefault(require('node:path'));
const program = new commander_1.Command();
exports.validate = program
  .name('validate')
  .description('Validate that packges adhere to your tag constraints')
  .action(async () => {
    const rootDirectory = await (0, data_project_1.getRootDirectory)();
    const packages = await (0, data_packages_1.getPackages)({ rootDirectory });
    const tagData = await (0, data_tags_1.getTagsData)({
      rootDirectory,
      packages,
    });
    const projectConfig = await (0, data_project_1.getProjectConfig)({
      rootDirectory,
    });
    const violationsByPackageName = {};
    const violations = await (0, data_violations_1.getViolationsData)({
      packages,
      projectConfig,
      tagData,
    });
    for (let i = 0; i < violations.length; i++) {
      const violation = violations[i];
      const currentViolations =
        violationsByPackageName[violation.sourcePackageName];
      violationsByPackageName[violation.sourcePackageName] = currentViolations
        ? [...currentViolations, violation]
        : [violation];
    }
    Object.keys(violationsByPackageName).forEach((packageName) => {
      const pkg = packages.find((pkg) => pkg.name === packageName);
      const pkgNameText = `📦 ${chalk_1.default.blue.bold.underline(
        packageName
      )}`;
      const projectConfigPath = pkg
        ? node_path_1.default.join(
            node_path_1.default.resolve(rootDirectory, pkg.path),
            './commonality.json'
          )
        : undefined;
      console.log(
        projectConfigPath
          ? (0, terminal_link_1.default)(
              pkgNameText,
              `file://${node_path_1.default.resolve(projectConfigPath)}`
            )
          : pkgNameText
      );
      const violations = violationsByPackageName[packageName];
      violations.forEach((violation) => {
        console.log(
          chalk_1.default.bold(
            `${violation.sourcePackageName} -> ${violation.targetPackageName}`
          )
        );
        console.log(`Constraint matching: ${violation.appliedTo}`);
        console.log(
          `${chalk_1.default.green('Allowed:')} ${
            violation.allowed?.length
              ? JSON.stringify(violation.allowed)
              : 'No packages allowed'
          }`
        );
        console.log(
          `${chalk_1.default.red('Found:')} ${
            violation.found?.length
              ? JSON.stringify(violation.found)
              : violation.allowed?.length
              ? chalk_1.default.dim('None')
              : 'Package found'
          }`
        );
        console.log('');
      });
    });
    console.log(
      chalk_1.default.red.bold(
        `Found ${violations.length} violations across ${
          Object.keys(violationsByPackageName).length
        } packages`
      )
    );
  });
