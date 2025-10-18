# eMercado Backend - SMS/WhatsApp

Backend para el sistema eMercado que permite enviar mensajes de WhatsApp usando Twilio.

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Rodrigoinzaurralde/eMercado-backend-sms.git
cd eMercado-backend-sms
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` con tus credenciales de Twilio:
```env
TWILIO_ACCOUNT_SID=tu_account_sid_aqui
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
PORT=3000
```

4. Ejecuta el servidor:
```bash
node server.js
```

## 📋 API Endpoints

### POST /enviar-sms
Envía un mensaje de WhatsApp usando Twilio.

**Body:**
```json
{
  "telefono": "+1234567890",
  "mensaje": "Tu mensaje aquí"
}
```

### GET /ping
Endpoint de prueba que responde "pong".

## 🛠️ Tecnologías

- Node.js
- Express.js
- Twilio API
- CORS

## 🔐 Variables de Entorno

Necesitas configurar las siguientes variables en tu archivo `.env`:

- `TWILIO_ACCOUNT_SID`: Tu SID de cuenta de Twilio
- `TWILIO_AUTH_TOKEN`: Tu token de autenticación de Twilio
- `PORT`: Puerto del servidor (opcional, por defecto 3000)
