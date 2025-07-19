import { Command } from 'commander';
import getLixStreamInfo from './src/utils/getLixStreamFileInfo.js';
import singleDownload from './src/commands/singleDownload.js';
const program = new Command();

program.name('titik kumpul').description('cli to download titik kumpul ytta');

program
  .command('single')
  .description(
    'download from single url example url https://vide0.me/e/ToDZqO04'
  )
  .argument('<url>', 'url to download')
  .action(async (str) => {
    await singleDownload(str);
  });
program.parse();
