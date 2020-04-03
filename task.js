import RNFS from 'react-native-fs';
const commonDir = RNFS.DocumentDirectoryPath;
import axios from 'axios';

export default class Task {
  constructor(host) {
    this.tasks = [];
    this.host = host;
  }

  add = task => {
    this.tasks.push(task);
  };

  run = async () => {
    await Promise.all(
      this.tasks.map(async task => {
        const {page, hash} = task;
        if (page !== 'common') {
          try {
            const htmlUrl = `${this.host}/${page}.html?ts=${Date.now()}`;
            const {data: html} = await axios.get(htmlUrl);
            await RNFS.writeFile(`${commonDir}/${page}.html`, html, 'utf8');
          } catch (error) {
            console.log(page, 'html error');
          }
        }
        const jsUrl = `${this.host}/${page}.${hash}.bundle.js`;
        try {
          const {data: js} = await axios.get(jsUrl);
          await RNFS.writeFile(
            `${commonDir}/${page}.${hash}.bundle.js`,
            js,
            'utf8',
          );
        } catch (error) {
          console.log(page, hash, 'error');
        }
      }),
    );
    console.log('下载完成');
    // const files = await RNFS.readDir(commonDir);
    // files.forEach(file => {
    //   console.log(file.path);
    // });
  };
}
