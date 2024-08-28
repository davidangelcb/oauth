import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Carga las credenciales desde el archivo
const credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../credentials.json'), 'utf8'));

const { client_id, client_secret, redirect_uris } = credentials;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Genera la URL de autorización
export function getAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
}

// Configura el token para el cliente OAuth
export function setCredentials(token: string) {
  oAuth2Client.setCredentials(JSON.parse(token));
}

export default oAuth2Client;
