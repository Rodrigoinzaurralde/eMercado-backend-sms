require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/enviar-sms', (req, res) => {
    const { telefono, mensaje } = req.body;
    client.messages.create({
        body: mensaje,
        from: '+15075165809', // Número Twilio SMS
        to: telefono
    })
    .then(message => res.json({ sid: message.sid }))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));