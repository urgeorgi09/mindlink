import crypto from "crypto";

// AES-256-GCM encryption - ТРЯБВА 32 байта ключ (64 hex chars)
const ALGO = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENC_KEY || "0".repeat(64), "hex");

if (!process.env.ENC_KEY || process.env.ENC_KEY.length !== 64) {
  console.warn("⚠️  ENC_KEY не е зададен правилно! Използва се временен ключ.");
  console.warn("Генерирай ключ с: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
}

/**
 * Криптира текст с AES-256-GCM
 * @param {string} text - Текст за криптиране
 * @returns {string} - "iv:tag:encrypted" format
 */
export function encrypt(text) {
  if (!text) return null;
  
  try {
    const iv = crypto.randomBytes(12); // 96-bit IV за GCM
    const cipher = crypto.createCipheriv(ALGO, KEY, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
  } catch (err) {
    console.error("Encryption error:", err);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Декриптира криптиран текст
 * @param {string} payload - "iv:tag:encrypted" format
 * @returns {string} - Декриптиран текст
 */
export function decrypt(payload) {
  if (!payload) return null;
  
  try {
    const [ivHex, tagHex, dataHex] = payload.split(":");
    
    if (!ivHex || !tagHex || !dataHex) {
      throw new Error("Invalid encrypted format");
    }
    
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const encrypted = Buffer.from(dataHex, "hex");
    
    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted.toString("utf8");
  } catch (err) {
    console.error("Decryption error:", err);
    return "[ДЕКРИПТИРАНЕТО СЕ ПРОВАЛИ]";
  }
}

/**
 * Генерира secure backup ключ за потребител
 * @param {string} userId - ml_user_id
 * @returns {string} - Seed phrase (първи 16 chars + HMAC)
 */
export function generateBackupKey(userId) {
  const hmac = crypto.createHmac("sha256", KEY);
  hmac.update(userId);
  const signature = hmac.digest("hex").substring(0, 16);
  
  return `${userId.substring(0, 16)}-${signature}`;
}

/**
 * Валидира backup ключ
 * @param {string} backupKey - Backup ключ от потребителя
 * @param {string} userId - ml_user_id за проверка
 * @returns {boolean}
 */
export function validateBackupKey(backupKey, userId) {
  try {
    const expectedKey = generateBackupKey(userId);
    return backupKey === expectedKey;
  } catch {
    return false;
  }
}

export default { encrypt, decrypt, generateBackupKey, validateBackupKey };