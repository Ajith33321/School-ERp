import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../database/school_erp.db');

let db: Database;

async function initDB() {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    console.log('SQLite Database connected at:', dbPath);
}

// Initialize on load
initDB().catch(console.error);

export const query = async (text: string, params: any[] = []) => {
    if (!db) await initDB();

    // Convert Postgres $1, $2... style to SQLite ? style
    const sqliteText = text.replace(/\$\d+/g, '?');

    // Postgres-style query result wrapper
    if (sqliteText.trim().toUpperCase().startsWith('SELECT')) {
        const rows = await db.all(sqliteText, params);
        return { rows, rowCount: rows.length };
    } else {
        const result = await db.run(sqliteText, params);
        // Map some result properties for compatibility
        return {
            rows: [],
            rowCount: result.changes,
            lastID: result.lastID
        };
    }
};

export default {
    query,
    connect: () => ({
        query: (t: string, p: any[]) => query(t, p),
        release: () => { }
    })
};
