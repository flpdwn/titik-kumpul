import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_BASE = 'https://api.lixstreamingcaio.com';
const AES_KEY = 'GNgN1lHXIFCQd8hSEZIeqozKInQTFNXj';
const AES_IV = '2Xk4dLo38c9Z2Q2a';

export default async function lixStreamFileInfo(fid) {
  try {
    const resourceInfo = await axios.post(
      `${API_BASE}/v2/s/home/resources/${fid}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Referer: `https://api.lixstreamingcaio.com`,
        },
      }
    );
    const { files } = resourceInfo.data;
    if (!files) {
      throw new Error('File not found');
    }
    const fileInfo = files[0];
    const fileName = fileInfo.display_name.replace(/\.m3u8$/i, '');
    const fileId = fileInfo.id;
    const fileSize = fileInfo.size;
    const thumbnail = fileInfo.thumbnail;
    const uid = resourceInfo.data.suid;
    let assetsUrl = `${API_BASE}/v2/s/assets/f?id=${fileId}&uid=${uid}`;
    const downloadUrlEncrypted = await axios.get(assetsUrl);
    if (!downloadUrlEncrypted.data?.url) {
      throw new Error('fail get encrypted url');
    }
    const encryptedUrl = downloadUrlEncrypted.data.url;
    const decryptedUrl = decryptAes(encryptedUrl, AES_KEY, AES_IV);
    return {
      fileName: fileName,
      fileSize: `${fileSize}`,
      downloadUrl: decryptedUrl,
      thumbnail,
    };
  } catch (error) {
    throw error;
  }
}
function decryptAes(base64Encrypted, key, iv) {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(base64Encrypted) },
    keyUtf8,
    {
      iv: ivUtf8,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}
