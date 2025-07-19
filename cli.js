import { Command } from 'commander';
import singleDownload from './src/commands/singleDownload.js';
import multiDownload from './src/commands/multiDownload.js';

const program = new Command();

program.name('titik kumpul').description('cli to download titik kumpul ytta');

program
  .command('single')
  .description('Download from single URL. Example: https://vide0.me/e/ToDZqO04')
  .argument('<url>', 'URL to download')
  .action(async (url) => {
    try {
      await singleDownload(url);
    } catch (err) {
      console.error(err);
    }
  });

program
  .command('multi')
  .description('Download from list (text file with each URL per line)')
  .argument('<filename>', 'Name of file with extension')
  .option('-o, --output <path>', 'Set custom output folder')
  .action(async (filename, options) => {
    try {
      console.log('File:', filename);
      console.log('Output folder:', options.output ?? 'default folder');

      await multiDownload(filename, options.output);
    } catch (err) {
      console.error(err);
    }
  });

program.parse();
