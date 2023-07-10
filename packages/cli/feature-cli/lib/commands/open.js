'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.open = void 0;
const commander_1 = require('commander');
const app_dashboard_1 = require('@commonalityco/app-dashboard');
const get_port_1 = __importDefault(require('get-port'));
const open_1 = __importDefault(require('open'));
const program = new commander_1.Command();
exports.open = program
  .name('open')
  .description('Open the Commonality Dashboard')
  .action(async () => {
    const port = await (0, get_port_1.default)({ port: 8888 });
    try {
      await (0, app_dashboard_1.start)(port);
      await (0, open_1.default)(`http://localhost:${port}`);
    } catch (error) {
      console.log(error);
    }
  });
