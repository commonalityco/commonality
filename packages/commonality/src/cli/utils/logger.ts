import c from 'picocolors';
import console from 'node:console';

export class Logger {
  output = '';

  addTotal({
    totalCount,
    passCount,
    warnCount,
    failCount,
    title,
  }: {
    totalCount: number;
    passCount: number;
    warnCount?: number;
    failCount: number;
    title: string;
  }) {
    const failText =
      failCount > 0 ? c.red(`${failCount} failed`) : c.dim('0 failed');
    const passText =
      passCount > 0 ? c.green(`${passCount} passed`) : c.dim('0 passed');
    const warnText =
      warnCount && warnCount > 0
        ? c.yellow(`${warnCount} warnings`)
        : c.dim('0 warnings');
    const totalText = c.dim(`(${totalCount})`);

    this.output +=
      typeof warnCount === 'number'
        ? `\n${title} ${failText} ${warnText} ${passText} ${totalText}`
        : `\n${title} ${failText} ${passText} ${totalText}`;
  }

  addSubText(text?: string) {
    if (text === undefined) {
      this.output += `\n${c.dim(`│`)}      `;
      return;
    }

    const textWithBorder = text
      .split('\n')
      .map((line) => `\n${c.dim(`│`)}      ${line}`)
      .join('');

    this.output += textWithBorder;
  }

  addPackageName({
    verbose,
    status,
    packageName,
    count,
  }: {
    verbose: boolean;
    status: 'pass' | 'fail';
    packageName: string;
    count: number;
  }) {
    const icon = status === 'fail' || verbose ? c.yellow('❯') : c.green('✓');
    const name =
      status === 'pass' && !verbose
        ? c.dim(packageName)
        : c.underline(packageName);
    const countText = c.dim(`(${count})`);

    this.output += `\n${icon} ${name} ${countText}`;
  }

  write() {
    console.log(this.output);
    this.output = '';
  }

  writeError(error: unknown) {
    if (error instanceof Error) {
      const status = c.bold(c.inverse(c.red(' Error: ')));
      const title = c.red(error.message);
      const stack = error.stack;

      console.log(`\n${status} ${title}\n${stack}`);
    }

    console.error(error);
  }

  clearScreen() {
    const ESC = '\u001B[';
    const ERASE_DOWN = `${ESC}J`;
    const CURSOR_TO_START = `${ESC}1;1H`;

    console.log(`${CURSOR_TO_START}${ERASE_DOWN}`);
  }
}
