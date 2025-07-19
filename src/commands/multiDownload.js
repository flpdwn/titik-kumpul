import fs from 'fs';
import path from 'path';
import getLixStreamInfo from '../utils/getLixStreamFileInfo.js';
import { nodeDownloader } from '../helpers/nodeDownloader.js';
import delay from 'delay';

export default async function multiDownload(listName, folderName) {
  try {
    const filePath = path.join(process.cwd(), listName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`file ${listName} not found`);
    }
    const urlArr = fs
      .readFileSync(listName, { encoding: 'utf-8' })
      .replace(/\r/g, '')
      .split('\n')
      .filter(Boolean);

    let successCount = 0;
    let errorCount = 0;
    for (const [index, url] of urlArr.entries()) {
      let data;
      try {
        data = await getLixStreamInfo(url);
        if (!data) {
          throw new Error('fail get file info ', url);
        }
        await nodeDownloader(
          data.downloadUrl,
          data.fileName,
          folderName ? folderName : 'downloads',
          index + 1,
          urlArr.length
        );
        successCount++;
      } catch (error) {
        console.error(`❌ fail for ${url}:`, error.message || error);
        errorCount++;
        continue;
      }
      await delay(1500);
    }
    console.log('--- Result ---');
    console.log(`Total URL     : ${urlArr.length}`);
    console.log(`Success       : ${successCount}`);
    console.log(`Fail          : ${errorCount}`);
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
}
