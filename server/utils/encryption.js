const crypto = require('crypto');

// Encrypt data for anonymous complaints
const encryptData = (text) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
  };
};

// Decrypt data for HOD access
const decryptData = (encryptedData, iv) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
  const decipher = crypto.createDecipher(algorithm, key);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Encrypt student ID for anonymous complaints
const encryptStudentId = (studentId) => {
  const data = encryptData(studentId.toString());
  return `${data.encryptedData}:${data.iv}`;
};

// Decrypt student ID (HOD only)
const decryptStudentId = (encryptedStudentId) => {
  const [encryptedData, iv] = encryptedStudentId.split(':');
  return decryptData(encryptedData, iv);
};

module.exports = {
  encryptStudentId,
  decryptStudentId,
  encryptData,
  decryptData,
};
