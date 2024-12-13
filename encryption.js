const sodium = require('sodium-native');

function encryptMessage(message) {
  const nonce = Buffer.alloc(sodium.crypto_secretbox_NONCEBYTES);
  const key = sodium.sodium_malloc(sodium.crypto_secretbox_KEYBYTES); // Secure buffer
  const messageBuffer = Buffer.from(message);
  const ciphertext = Buffer.alloc(messageBuffer.length + sodium.crypto_secretbox_MACBYTES);

  // Generate random nonce and key
  sodium.randombytes_buf(nonce);
  sodium.randombytes_buf(key);

  // Encrypt the message
  sodium.crypto_secretbox_easy(ciphertext, messageBuffer, nonce, key);

  return { ciphertext, nonce, key };
}

function decryptMessage(ciphertext, nonce, key) {
  const plainText = Buffer.alloc(ciphertext.length - sodium.crypto_secretbox_MACBYTES);

  // Attempt to decrypt
  if (!sodium.crypto_secretbox_open_easy(plainText, ciphertext, nonce, key)) {
    throw new Error('Decryption failed!');
  }

  return plainText.toString();
}

// Example usage
const message = 'Hello, World!';
const { ciphertext, nonce, key } = encryptMessage(message);

console.log('Encrypted message:', ciphertext);

try {
  const decryptedMessage = decryptMessage(ciphertext, nonce, key);
  console.log('Decrypted message:', decryptedMessage);
} catch (err) {
  console.error(err.message);
}

module.exports = { encryptMessage, decryptMessage };