import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ALGO = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENC_KEY || "0".repeat(64), "hex");

/**
 * Криптира текст с AES-256-GCM
 */
export function encrypt(text) {
    if (!text) return null;
    try {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(ALGO, KEY, iv);
        const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
        const tag = cipher.getAuthTag();
        return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
    } catch (err) {
        console.error("Encryption error:", err);
        throw new Error("Failed to encrypt data");
    }
}

/**
 * Декриптира текст
 */
export function decrypt(payload) {
    if (!payload || !payload.includes(':')) return payload;
    try {
        const [ivHex, tagHex, dataHex] = payload.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const tag = Buffer.from(tagHex, "hex");
        const encrypted = Buffer.from(dataHex, "hex");
        const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
        decipher.setAuthTag(tag);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString("utf8");
    } catch (err) {
        console.error("Decryption error:", err);
        return "[ДЕКРИПТИРАНЕТО СЕ ПРОВАЛИ]";
    }
}

export default { encrypt, decrypt };