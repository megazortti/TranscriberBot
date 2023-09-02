import qrcode from 'qrcode-terminal';
import { getMessage } from './thegpt.js';
import wpp from 'whatsapp-web.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { Whisper } from './whisper.js';

const Client = wpp.Client;
const LocalAuth = wpp.LocalAuth;
const { Buttons } = wpp;
const { List } = wpp; 
const client = new Client({ authStrategy: new LocalAuth() });
const whisper = new Whisper();



const isWhiteListed = (user)=>{
    if(user == undefined){
        return false;
    }
    if(user.includes("Amoire")){
        return true;
    }else{
        return false;
    }
}

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('message', async (message) => {
    (async ()=>{
        console.log("---");
        console.log("body");
        console.log(message.rawData);
        console.log("---");
        console.log("---");
        
    })();
    console.log((await message.getContact()).name);
    if (message.hasMedia) {
        let downloadMedia = await message.downloadMedia();
        let user = await message.getContact().name;
        console.log(user);
        let mediaData = downloadMedia.data;
        console.log(downloadMedia.mimetype);
        if (downloadMedia.mimetype.includes("audio") && ( (await message.getContact()).name.includes('Amoire') || (await message.getContact()).name.includes('Breno Freitas') || (await message.getContact()).name.includes('Dudo Mazzotti') || (await message.getContact()).name.includes('Sam') )) {
            let audioFile = uuidv4() + 'audio.ogg'
            fs.writeFile(audioFile, mediaData, { encoding: 'base64' }, async function (err) {
                console.log('File created');
                let transcribed = await whisper.toText(audioFile);
                transcribed = await whisper.readReturn(audioFile);
                transcribed = await getMessage(`considere a mensagem a seguir: "${transcribed}". A mesma foi gerada através de reconhecimento de áudio, ou seja, pode não ser perfeita e ter ruídos.Reescreva a mesma corrigindo qualquer erro gramatical e/ou outro. Não altere o sentido, nem flexione as palavras. apenas corrija gramaticalmente. Sua resposta deve ser apenas o que está dentro das aspas corrigindo, sem nada antes, nem depois`);
                console.log(transcribed);
                message.reply(`*Transcrito e corrigido:* 
                 _${transcribed}_`);

            });
        }
        console.log('media downloaded');
    }

    if (message.body.startsWith('!GPT')) {
        console.log(message.body);
        (async () => {
            let resposta = await getMessage(message.body.replace('!GPT', ''));
            message.reply(resposta);
        })()
    }else if(message.body.startsWith('!TEST')){
        console.log('got here buddy');
        message.reply(message.rawData);}
})

console.log(isWhiteListed("Amoire"));
client.initialize();
