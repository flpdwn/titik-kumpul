import { Command } from 'commander';
import singleDownload from './src/commands/singleDownload.js';
import multiDownload from './src/commands/multiDownload.js';
const program = new Command();

program.name('titik kumpul').description('cli to download titik kumpul ytta');

program
  .command('-single')
  .description(
    'download from single url example url https://vide0.me/e/ToDZqO04'
  )
  .argument('<url>', 'url to download')
  .action(async (str) => {
    try {
      await singleDownload(str);
    } catch (err) {
      console.log(err);
    }
  });
program
  .command('multi')
  .description('download from list')
  .argument('<filename>', 'name of file with extension')
  .action(async (str) => {
    try {
      await multiDownload(str);
    } catch (err) {
      console.log(err);
    }
  });
program.parse();
