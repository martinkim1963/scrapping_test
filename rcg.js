import { createWorker } from 'tesseract.js';
import fetch from 'node-fetch';

const url = 'https://www.nhis.or.kr/cms/CaptCha.jsp?0.883843377791111.png';
const url2 = 'https://images.datacamp.com/image/upload/v1668167354/Excel_Dashboard_Strategy_43cfd06a9e.png'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';


(async () => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent
    }
  })
  const image = await response.arrayBuffer()
  const worker = await createWorker();
  const { data: { text } } = await worker.recognize(image);
  console.log(text);
  await worker.terminate();
})();
