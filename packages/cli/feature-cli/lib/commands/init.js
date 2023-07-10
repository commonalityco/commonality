'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.init = void 0;
const commander_1 = require('commander');
const chalk_1 = __importDefault(require('chalk'));
const program = new commander_1.Command();
exports.init = program
  .name('init')
  .description('Create a new project in Commonality')
  .option(
    '--cwd <path>',
    "A relative path to the root of your monorepo. We will attempt to automatically detect this by looking for your package manager's lockfile."
  )
  .action(async ({ cwd }, action) => {
    console.log(chalk_1.default.bold.blue('\nWelcome to Commonality'));
    console.log('Here is what we will will do:');
    console.log('1. Create a new project within Commonality');
    console.log('2. Create configuration files');
    console.log('3. Open the Commonality Dashboard');
  });
