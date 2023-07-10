'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.store = void 0;
const configstore_1 = __importDefault(require('configstore'));
exports.store = new configstore_1.default('commonality');
