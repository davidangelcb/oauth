import express from 'express';
import oAuth2Client, { getAuthUrl, setCredentials } from './auth/oauth2Client';
import { listMessages, getMessage , getMsg } from './gmail/gmailService';

const app = express();
app.use(express.json());

// Ruta para iniciar el flujo de autenticación
app.get('/auth', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// Ruta para manejar el callback de OAuth2
app.get('/auth/callback', (req, res) => {
  const code = req.query.code as string;
  console.log(code)
  if (code) {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        res.status(500).send('Error retrieving access token');
        return;
      }
      setCredentials(JSON.stringify(token));
      res.send('Authentication successful! You can now <a href="/messages">view messages</a>.');
    });
  } else {
    res.status(400).send('No authorization code provided');
  }
});

// Ruta para listar mensajes
app.get('/messages', async (req, res) => {
  try {
    const messages = await listMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).send('Error fetching messages');
  }
});

// Ruta para leer un mensaje específico
app.get('/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const message = await getMessage(id);
    res.json(message);
  } catch (error) {
    res.status(500).send('Error fetching message');
  }
});
// Ruta para leer un attach específico
app.get('/getMsg/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const message = await getMsg(id);
      res.json(message);
    } catch (error) {
      res.status(500).send('Error fetching attach');
    }
  });
// Iniciar el servidor
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
