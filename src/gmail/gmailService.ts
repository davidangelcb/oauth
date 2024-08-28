import { google } from 'googleapis';
import oAuth2Client from '../auth/oauth2Client';

// Configura el cliente de Gmail
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

// Función para leer los correos
export async function listMessages() {
  try {
    const res = await gmail.users.messages.list({ userId: 'me' });
    const messages = res.data.messages || [];
    console.log('Messages:', messages);
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

// Función para leer un correo específico
export async function getMessage(messageId: string) {
  try {
    const res = await gmail.users.messages.get({ userId: 'me', id: messageId });
    console.log('Message:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching message:', error);
    throw error;
  }
}


async function getAttachment(messageId: string, attachmentId: string) {
    try {
      const res = await gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: messageId,
        id: attachmentId
      });
  
      const attachment = res.data;
      const data = attachment.data || '';
      const buffer = Buffer.from(data, 'base64');
      return buffer;
    } catch (error) {
      console.error('Error fetching attachment:', error);
      throw error;
    }
}

function extractAttachments(message: any) {
    const attachments: { [key: string]: string } = {};
  
    if (message.payload && message.payload.parts) {
      for (const part of message.payload.parts) {
        if (part.filename && part.body && part.body.attachmentId) {
          attachments[part.filename] = part.body.attachmentId;
        }
      }
    }
  
    return attachments;
}

export async function getMsg(messageId: string) {
    try {
    //  const messageId = 'your-message-id';
      const message = await getMessage(messageId);
      const attachments = extractAttachments(message);
      let listObjects: Object[] = []
      for (const [filename, attachmentId] of Object.entries(attachments)) {
        console.log(`Downloading attachment: ${filename}`);
        const attachmentBuffer = await getAttachment(messageId, attachmentId);
        // Puedes guardar el archivo en disco o procesarlo aquí
        console.log(`Attachment ${filename} downloaded. Size: ${attachmentBuffer.length} bytes`);
        listObjects.push(filename);
      }
       
      return listObjects;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  