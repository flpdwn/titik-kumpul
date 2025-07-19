import getLixStreamInfo from '../utils/getLixStreamFileInfo.js';
import { nodeDownloader } from '../helpers/nodeDownloader.js';
export default async function singleDownload(str) {
  try {
    const data = await getLixStreamInfo(str);
    if (!data) {
      throw new Error('fail get file info ', str);
    }
    await nodeDownloader(data.downloadUrl, data.fileName, 'downloads');
  } catch (error) {
    console.log(error);
  }
}
