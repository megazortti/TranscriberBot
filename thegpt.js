import { ChatGPTUnofficialProxyAPI } from 'chatgpt';
import dotenv from 'dotenv';
dotenv.config()



export async function getMessage(message) {
  const api = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.SECRET,
    apiReverseProxyUrl: 'https://ai.fakeopen.com/api/conversation',
    timeoutMs: 10000
  })
  const res = await api.sendMessage(message);
  return res.text;
  
}
