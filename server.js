require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const https = require('https');
const fs = require('fs'); 

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Variables de Entorno de Render
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const RENDER_PORT = process.env.PORT || 3000;
const API_SECRET = process.env.API_SECRET || "0570-Clave-Rend3r-Logs-x2p1T9"; // Clave para /descargar-logs
const LOG_FILE = 'sms_log.txt';
const PING_INTERVAL_MS = 720000; 

function keepAlive() {
    if (process.env.RENDER) {
        https.get(APP_URL, (res) => {
            console.log(`Keep-alive ping: ${res.statusCode} (${new Date().toLocaleTimeString()})`);
        }).on('error', (err) => {
            console.error(`Error en keep-alive: ${err.message}`);
        });
    }
    setTimeout(keepAlive, PING_INTERVAL_MS);
}

app.post('/enviar-sms', (req, res) => {
    const { telefono, mensaje } = req.body;
    const timestamp = new Date().toLocaleString('es-UY', { 
    timeZone: 'America/Montevideo'
    });
    const logEntry = `[${timestamp}] SMS enviado a: ${telefono} | Mensaje: "${mensaje}"\n`;
    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) console.error('Error al escribir el log:', err);
        else console.log(`Log guardado: ${telefono}`);
    });
    
    //Envia el SMS
    client.messages.create({
        body: mensaje,
        from: 'whatsapp:+14155238886', 
        to: `whatsapp:${telefono}`  
    })
    .then(message => res.json({ sid: message.sid }))
    .catch(error => res.status(500).json({ error: error.message }));
});


app.get('/descargar-logs', (req, res) => {
    const providedKey = req.headers['x-api-key'];

    if (providedKey !== API_SECRET) {
        return res.status(401).json({ error: 'Acceso no autorizado. Clave X-API-KEY incorrecta.' });
    }
    if (fs.existsSync(LOG_FILE)) {
        res.download(LOG_FILE, (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            fs.unlink(LOG_FILE, (err) => {
                if (err) console.error('Error al borrar el log temporal:', err);
                else console.log('Log temporal borrado de Render.');
            });
        });
    } else {
        res.status(404).json({ error: 'Archivo de log no encontrado.' });
    }
});

app.get('/', (req, res) => {
    res.send('Servicio de SMS Activo ✅');
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(RENDER_PORT, () => {
    console.log(`Servidor escuchando en puerto ${RENDER_PORT}`);
    
    // Iniciar el auto-ping
    if (process.env.RENDER) {
        console.log("🚀 Keep-alive iniciado.");
        keepAlive();
    }
});