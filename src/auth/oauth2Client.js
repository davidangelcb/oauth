"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthUrl = getAuthUrl;
exports.setCredentials = setCredentials;
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Carga las credenciales desde el archivo
const credentials = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../credentials.json'), 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// Genera la URL de autorización
function getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
}
// Configura el token para el cliente OAuth
function setCredentials(token) {
    oAuth2Client.setCredentials(JSON.parse(token));
}
exports.default = oAuth2Client;
