import { JournalEntry } from '../models/index.js';
import { encrypt, decrypt } from '../utils/crypto.js';

export const createEntry = async (req, res) => {
    try {
        const { content, title, tags } = req.body;
        
        // КРИПТИРАНЕ преди запис
        const encryptedContent = encrypt(content);
        
        const entry = await JournalEntry.create({
            userId: req.user.id,
            title,
            contentEnc: encryptedContent, 
            wordCount: content.split(' ').length,
            tags
        });

        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEntries = async (req, res) => {
    try {
        const entries = await JournalEntry.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        // ДЕКРИПТИРАНЕ преди изпращане към фронтенда
        const decryptedEntries = entries.map(e => ({
            ...e.toJSON(),
            content: decrypt(e.contentEnc)
        }));

        res.json(decryptedEntries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};