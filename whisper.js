import { spawn } from 'node:child_process';
import fs from 'fs';

export class Whisper {

  readReturn(audioFile) {
    return new Promise((resolve,reject) => {
      const data = fs.readFileSync(audioFile.replace('.ogg','.txt'),'utf8');
      resolve(data.toString());
    })
  }

  eraseFiles(files) {
    let flag = 0;
    files.map(i => {
      fs.unlink(i.replace(".ogg",""), (err) => {
        if (err) {
          flag = 1;
        }
      });
    });
    return true;
  }

  toText(audioFile) {
    return new Promise((resolve, reject) => {
      const bat = spawn('whisper', [audioFile, '--model', 'small', '--language', 'Portuguese']);
      let retorno = '';

      bat.stdout.on('data', (data) => {
        retorno = retorno + data.toString();
      });

      bat.stderr.on('data', (data) => {
        retorno = retorno + data.toString();
      });

      bat.on('exit', (code) => {
        let files = [`${audioFile}.tsv`, `${audioFile}.vtt`,`${audioFile}.json`,audioFile];
        this.eraseFiles(files);
        resolve(retorno);
      });
    });
  }
}
