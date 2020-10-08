import chalk from 'chalk';
import readline from 'readline';
import {ProgressPlugin} from 'webpack';

type Options = {
  logTotalDuration?: boolean;
};

export class ProgressWebpackPlugin extends ProgressPlugin {
  constructor(options: Options = {logTotalDuration: true}) {
    const absoluteProjectPath = process.cwd();
    let startTime = Date.now();
    let previousStep = 0;
    let lineOutput = '';

    // Use the internal webpack progress plugin as the base of the logger
    super((progress, message, moduleProgress, _, moduleName) => {
      lineOutput = chalk.yellow(`[${Math.round(progress * 100)}%] `);

      // Reset process variables for this run
      if (previousStep === 0) {
        startTime = Date.now();
      }

      // STEP 1: COMPILATION
      if (progress >= 0 && progress < 0.1) {
        // Skip if we jumped back a step, else update the step counter
        if (previousStep > 1) {
          return;
        }
        previousStep = 1;
        lineOutput += chalk.white('Compiling modules ...');
      }

      // STEP 2: BUILDING
      if (progress >= 0.1 && progress <= 0.7) {
        // Skip if we jumped back a step, else update the step counter
        if (previousStep > 2) {
          return;
        }
        previousStep = 2;

        // Log progress line
        lineOutput += chalk.white('Building modules ...');

        // Log additional information (if possible)
        if (moduleName !== undefined && moduleProgress !== undefined) {
          let betterModuleName = moduleName;

          // Only show the file that is actually being processed (and remove all details about used loaders)
          if (betterModuleName.indexOf('!') !== -1) {
            const splitModuleName = betterModuleName.split('!');
            betterModuleName = splitModuleName[splitModuleName.length - 1];
          }

          // Transform absolute paths into relative ones (to shorten the so so incredible long path)
          if (betterModuleName.indexOf(absoluteProjectPath) !== -1) {
            betterModuleName = betterModuleName
              .split(`${absoluteProjectPath}`)[1] // Transform absolute path to relative one
              .substring(1); // Remove leading path slash
          }

          // Improve the path presentation further by enforcing style consistency and removing unnecessary details
          betterModuleName = betterModuleName
            .replace(/\\/g, '/')
            .replace('./', '')
            .replace('multi ', '');

          // Add extra details about whether the currently processed module is an internal or external one
          if (betterModuleName.startsWith('node_modules')) {
            betterModuleName = `${betterModuleName} ~ external`;
          }
          if (betterModuleName.startsWith('src')) {
            betterModuleName = `${betterModuleName} ~ internal`;
          }

          const [done, all] = moduleProgress.split('/');
          lineOutput += chalk.grey(` (${done} of ${all} :: ${betterModuleName})`);
        }
      }

      // STEP 3: OPTIMIZATION
      if (progress > 0.7 && progress < 0.95) {
        // Skip if we jumped back a step, else update the step counter
        if (previousStep > 3) {
          return;
        }
        previousStep = 3;

        // Log progress line (with sub-progress indicator)
        lineOutput += chalk.white('Optimizing modules ...');
        const formattedMessageExtra = progress === 0.91 ? ' -- may take a while' : '';
        lineOutput += chalk.grey(` (${message}${formattedMessageExtra})`);
      }

      // STEP 4: EMIT
      if (progress >= 0.95 && progress < 1) {
        // Skip if we jumped back a step, else update the step counter
        if (previousStep > 4) {
          return;
        }
        previousStep = 4;
        lineOutput += chalk.white('Emiting files ...');
      }

      // STEP 5: FOOTER
      if (progress === 1) {
        // Calculate process time
        previousStep = 0;
        const finishTime = Date.now();
        const processTime = ((finishTime - startTime) / 1000).toFixed(3);
        if (options.logTotalDuration) {
          process.stdout.write(
            chalk.yellow('[Webpack] ') + chalk.greenBright(`Finished in ${processTime} seconds.\n`)
          );
        }
      } else {
        // Log to stdout
        readline.clearLine(process.stdout, 0);
        process.stdout.write(`${lineOutput}\r`);
      }
    });
  }
}

export default ProgressWebpackPlugin;
