import delay from 'delay';
import lixStreamFileInfo from './src/service/lixstream.js';
import fs from 'fs';
import path from 'path';
(async () => {
  try {
    const listUrl = fs
      .readFileSync('list.txt', { encoding: 'utf-8' })
      .replace(/\r/g, '')
      .split('\n');
    for (const url of listUrl) {
      const fid = path.basename(url);
      let data;
      try {
        data = await lixStreamFileInfo(fid);
      } catch (error) {
        console.log(error);
        continue;
      }
      console.log({
        url,
        ...data,
      });

      await delay(1500);
    }
  } catch (error) {
    console.log(error);
  }
})();
