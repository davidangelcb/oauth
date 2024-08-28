"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const oauth2Client_1 = __importStar(require("./auth/oauth2Client"));
const gmailService_1 = require("./gmail/gmailService");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Ruta para iniciar el flujo de autenticación
app.get('/auth', (req, res) => {
    const url = (0, oauth2Client_1.getAuthUrl)();
    res.redirect(url);
});
// Ruta para manejar el callback de OAuth2
app.get('/auth/callback', (req, res) => {
    const code = req.query.code;
    console.log(code);
    if (code) {
        oauth2Client_1.default.getToken(code, (err, token) => {
            if (err) {
                res.status(500).send('Error retrieving access token');
                return;
            }
            (0, oauth2Client_1.setCredentials)(JSON.stringify(token));
            res.send('Authentication successful! You can now <a href="/messages">view messages</a>.');
        });
    }
    else {
        res.status(400).send('No authorization code provided');
    }
});
// Ruta para listar mensajes
app.get('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield (0, gmailService_1.listMessages)();
        res.json(messages);
    }
    catch (error) {
        res.status(500).send('Error fetching messages');
    }
}));
// Ruta para leer un mensaje específico
app.get('/messages/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const message = yield (0, gmailService_1.getMessage)(id);
        res.json(message);
    }
    catch (error) {
        res.status(500).send('Error fetching message');
    }
}));
// Ruta para leer un attach específico
app.get('/getMsg/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const message = yield (0, gmailService_1.getMsg)(id);
        res.json(message);
    }
    catch (error) {
        res.status(500).send('Error fetching attach');
    }
}));
// Iniciar el servidor
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
