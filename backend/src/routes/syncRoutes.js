const express = require('express');
const router = express.Router();
const { generateSyncQR } = require('../sync/qrGenerator');

let syncServer = null;

function setSyncServer(server) {
  syncServer = server;
}

router.get('/qr', async (req, res) => {
  try {
    if (!syncServer) {
      return res.status(500).json({ error: 'Servidor de sincronização não iniciado' });
    }

    const qrData = await generateSyncQR(syncServer);
    res.json(qrData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/info', (req, res) => {
  if (!syncServer) {
    return res.status(500).json({ error: 'Servidor de sincronização não iniciado' });
  }

  const info = syncServer.getConnectionInfo();
  res.json(info);
});

router.get('/devices', (req, res) => {
  if (!syncServer) {
    return res.status(500).json({ error: 'Servidor de sincronização não iniciado' });
  }

  const devices = syncServer.getConnectedDevices();
  res.json({ devices });
});

router.get('/status', (req, res) => {
  if (!syncServer) {
    return res.status(500).json({ error: 'Servidor de sincronização não iniciado' });
  }

  const devices = syncServer.getConnectedDevices();
  const info = syncServer.getConnectionInfo();

  res.json({
    status: 'online',
    port: info.port,
    connectedDevices: devices.length,
    devices: devices,
    tokenExpiresIn: info.expiresIn
  });
});

router.post('/regenerate-token', (req, res) => {
  if (!syncServer) {
    return res.status(500).json({ error: 'Servidor de sincronização não iniciado' });
  }

  syncServer.regenerateToken();
  res.json({ 
    message: 'Token regenerado com sucesso',
    expiresIn: syncServer.getConnectionInfo().expiresIn
  });
});

router.post('/disconnect/:deviceId', (req, res) => {
  if (!syncServer) {
    return res.status(500).json({ error: 'Servidor de sincronização não iniciado' });
  }

  const { deviceId } = req.params;
  const disconnected = syncServer.disconnectDevice(deviceId);

  if (disconnected) {
    res.json({ message: 'Dispositivo desconectado' });
  } else {
    res.status(404).json({ error: 'Dispositivo não encontrado' });
  }
});

router.delete('/device/:deviceId', (req, res) => {
  if (!syncServer) {
    return res.status(500).json({ error: 'Servidor de sincronização não iniciado' });
  }

  const { deviceId } = req.params;
  const disconnected = syncServer.disconnectDevice(deviceId);

  if (disconnected) {
    res.json({ message: 'Dispositivo desconectado' });
  } else {
    res.status(404).json({ error: 'Dispositivo não encontrado' });
  }
});

module.exports = { router, setSyncServer };
