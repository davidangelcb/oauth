"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMessages = listMessages;
exports.getMessage = getMessage;
exports.getMsg = getMsg;
const googleapis_1 = require("googleapis");
const oauth2Client_1 = __importDefault(require("../auth/oauth2Client"));
// Configura el cliente de Gmail
const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oauth2Client_1.default });
// Función para leer los correos
function listMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield gmail.users.messages.list({ userId: 'me' });
            const messages = res.data.messages || [];
            console.log('Messages:', messages);
            return messages;
        }
        catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    });
}
// Función para leer un correo específico
function getMessage(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield gmail.users.messages.get({ userId: 'me', id: messageId });
            console.log('Message:', res.data);
            return res.data;
        }
        catch (error) {
            console.error('Error fetching message:', error);
            throw error;
        }
    });
}
function getAttachment(messageId, attachmentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield gmail.users.messages.attachments.get({
                userId: 'me',
                messageId: messageId,
                id: attachmentId
            });
            const attachment = res.data;
            const data = attachment.data || '';
            const buffer = Buffer.from(data, 'base64');
            return buffer;
        }
        catch (error) {
            console.error('Error fetching attachment:', error);
            throw error;
        }
    });
}
function extractAttachments(message) {
    const attachments = {};
    if (message.payload && message.payload.parts) {
        for (const part of message.payload.parts) {
            if (part.filename && part.body && part.body.attachmentId) {
                attachments[part.filename] = part.body.attachmentId;
            }
        }
    }
    return attachments;
}
function getMsg(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //  const messageId = 'your-message-id';
            const message = yield getMessage(messageId);
            const attachments = extractAttachments(message);
            let listObjects = [];
            for (const [filename, attachmentId] of Object.entries(attachments)) {
                console.log(`Downloading attachment: ${filename}`);
                const attachmentBuffer = yield getAttachment(messageId, attachmentId);
                // Puedes guardar el archivo en disco o procesarlo aquí
                console.log(`Attachment ${filename} downloaded. Size: ${attachmentBuffer.length} bytes`);
                listObjects.push(filename);
            }
            return listObjects;
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
