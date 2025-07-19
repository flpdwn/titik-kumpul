import axios from 'axios';
import fs from 'fs';
import path from 'path';
import cliProgress from 'cli-progress';

export async function nodeDownloader(
  url,
  filename,
  folder = 'downloads',
  current,
  total
) {
  const filePath = path.join('downloads', folder, filename);
  fs.mkdirSync(path.join('downloads', folder), { recursive: true });
  if (fs.existsSync(filePath)) {
    console.log(`${filename} already downloaded`);
    return;
  }

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const totalLength = parseInt(response.headers['content-length'], 10);

    const progressBar = new cliProgress.SingleBar(
      {
        format: current
          ? `${filename} | {percentage}% | {value} / {total} bytes | ${current} / ${total}`
          : `${filename} | {percentage}% | {value} / {total} bytes`,
      },
      cliProgress.Presets.shades_classic
    );

    let downloaded = 0;
    progressBar.start(totalLength, 0);

    const writer = fs.createWriteStream(filePath);
    response.data.on('data', (chunk) => {
      downloaded += chunk.length;
      progressBar.update(downloaded);
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
      response.data.on('error', reject);
    });

    progressBar.stop();
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  } catch (err) {
    console.error(`fail download${filename}:`, err.message);
  }
}
