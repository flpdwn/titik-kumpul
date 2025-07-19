import path from 'path';
import lixStreamFileInfo from '../services/lixstream.js';
export default async function getLixStreamInfo(url) {
  try {
    const fid = path.basename(url);
    let data;
    try {
      data = await lixStreamFileInfo(fid);
      return {
        url,
        ...data,
      };
    } catch (error) {
      console.error(`fail ${url}:`, error.message || error);
      process.exit(0);
    }
  } catch (error) {
    console.log(error);
  }
}
