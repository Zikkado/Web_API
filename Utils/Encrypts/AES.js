const crypto = require('crypto');
const ENC_KEY = "12345678909876543212345678909876"; //32 Bytes
const IV = "1234567890987654"; //16 Bytes

class Encrypts {
  encrypt(text) {

    let cipher = crypto.createCipheriv('aes-256-cfb', ENC_KEY, IV);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    return (encrypted += cipher.final('base64'));
  };

  decrypt(text) {
    let decipher = crypto.createDecipheriv('aes-256-cfb', ENC_KEY, IV);
    let decrypted = decipher.update(text, 'base64', 'utf8');
    return (decrypted += decipher.final('utf8'));
  };
}



module.exports = new Encrypts();

