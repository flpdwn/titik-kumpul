import fs from 'fs';
import path from 'path';
import getLixStreamInfo from '../utils/getLixStreamFileInfo.js';
import { nodeDownloader } from '../helpers/nodeDownloader.js';
import delay from 'delay';

export default async function multiDownload(str) {
  try {
    const filePath = path.join(process.cwd(), str);
    if (!fs.existsSync(filePath)) {
      throw new Error(`file ${str} not found`);
    }
    const urlArr = fs
      .readFileSync(str, { encoding: 'utf-8' })
      .replace(/\r/g, '')
      .split('\n')
      .filter(Boolean);

    let successCount = 0;
    let errorCount = 0;
    for (const url of urlArr) {
      let data;
      try {
        data = await getLixStreamInfo(url);
        if (!data) {
          throw new Error('fail get file info ', str);
        }
        await nodeDownloader(data.downloadUrl, data.fileName, 'downloads');
        successCount++;
      } catch (error) {
        console.error(`❌ fail for ${url}:`, error.message || error);
        errorCount++;
        continue;
      }
      await delay(1500);
    }
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
}
