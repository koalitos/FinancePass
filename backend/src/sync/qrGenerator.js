const QRCode = require('qrcode');

async function generateSyncQR(syncServer) {
  try {
    const info = syncServer.getConnectionInfo();
    const qrData = JSON.stringify(info);
    
    // Gera QR Code como Data URL (base64)
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });

    return {
      qrCode: qrCodeDataURL,
      info: {
        ip: info.ip,
        port: info.port,
        expiresIn: info.expiresIn
      }
    };
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw error;
  }
}

async function generateSyncQRText(syncServer) {
  try {
    const info = syncServer.getConnectionInfo();
    const qrData = JSON.stringify(info);
    
    // Gera QR Code como texto ASCII (para terminal)
    const qrCodeText = await QRCode.toString(qrData, {
      type: 'terminal',
      small: true
    });

    return qrCodeText;
  } catch (error) {
    console.error('Erro ao gerar QR Code texto:', error);
    throw error;
  }
}

module.exports = { 
  generateSyncQR,
  generateSyncQRText
};
