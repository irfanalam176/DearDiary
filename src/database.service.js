import SQLite from 'react-native-sqlite-storage';
import { v4 as uuidv4 } from './Key';
// Enable promise-based API
SQLite.enablePromise(true);

const databaseName = 'DearDiary.db';
const databaseVersion = '1.0';
const databaseDisplayName = 'Dear Diary Database';
const databaseSize = 200000; // 200KB

const openDatabase = async () => {
  return SQLite.openDatabase(
    databaseName,
    databaseVersion,
    databaseDisplayName,
    databaseSize,
  );
};

const initializeDatabase = async () => {
  try {
    const db = await openDatabase();

    // Create tables

    // Create tables again with UUID (CHAR(36))
    await db.executeSql(`
  CREATE TABLE IF NOT EXISTS entries (
    id CHAR(36) PRIMARY KEY,
    title TEXT,
    content TEXT,
    date TEXT,
    synced INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    await db.executeSql(`
  CREATE TABLE IF NOT EXISTS events (
    id CHAR(36) PRIMARY KEY,
    title TEXT,
    content TEXT,
    date TEXT,
    synced INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    await db.executeSql(`
  CREATE TABLE IF NOT EXISTS protected (
    id CHAR(36) PRIMARY KEY,
    title TEXT,
    content TEXT,
    date TEXT,
    synced INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    await db.executeSql(`
  CREATE TABLE IF NOT EXISTS lock (
    id CHAR(36) PRIMARY KEY,
    code TEXT,
    question TEXT,
    answer TEXT,
    synced INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    await db.executeSql(`
  CREATE TABLE IF NOT EXISTS settings (
    id CHAR(36) PRIMARY KEY,
    key TEXT UNIQUE,
    value TEXT
  );
`);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// CRUD Operations for Diary Entries
const DiaryRepository = {
  createEntry: async entry => {
    const db = await openDatabase();
    const { title, content, date } = entry;
    const uuid = uuidv4();
    const result = await db.executeSql(
      'INSERT INTO entries (id,title, content, date, synced) VALUES (?,?, ?, ?, ?)',
      [uuid, title, content, date, 0], // 0 means not synced yet
    );
    return result[0].insertId;
  },

  getEntries: async () => {
    const db = await openDatabase();
    const results = await db.executeSql(
      'SELECT * FROM entries ORDER BY created_at DESC',
    );
    return results[0].rows.raw();
  },

  updateEntry: async entry => {
    const db = await openDatabase();
    const { title, content,date, id } = entry;
    const result = await db.executeSql(
      'UPDATE entries SET title = ?, content = ?, date=? WHERE id = ?',
      [title, content,date, id],
    );
    return result[0];
  },

  deleteEntry: async id => {
    const db = await openDatabase();
    const result = await db.executeSql('DELETE FROM entries WHERE id = ?', [
      id,
    ]);
    return result[0];
  },

  // events code
  createEventsEntry: async entry => {
    const db = await openDatabase();
    const { title, content, date } = entry;
    const uuid = uuidv4();
    const result = await db.executeSql(
      'INSERT INTO events (id,title, content, date, synced) VALUES (?,?, ?, ?, ?)',
      [uuid, title, content, date, 0], // 0 means not synced yet
    );
    return result[0].insertId;
  },
  getEventsEntries: async () => {
    const db = await openDatabase();
    const results = await db.executeSql(
      'SELECT * FROM events ORDER BY created_at DESC',
    );

    return results[0].rows.raw();
  },
  updateEventsEntry: async entry => {
    const db = await openDatabase();
    const { title, content,date, id } = entry;
    const result = await db.executeSql(
      'UPDATE events SET title = ?, content = ?,date=? WHERE id = ?',
      [title, content,date, id],
    );
    return result[0];
  },
  deleteEventsEntry: async id => {
    const db = await openDatabase();
    const result = await db.executeSql('DELETE FROM events WHERE id = ?', [id]);
    return result[0];
  },

  // protected database
  createProtectedEntry: async entry => {
    const db = await openDatabase();
    const { title, content, date } = entry;
    const uuid = uuidv4();
    const result = await db.executeSql(
      'INSERT INTO protected (id,title, content, date, synced) VALUES (?,?, ?, ?, ?)',
      [uuid, title, content, date, 0], // 0 means not synced yet
    );
    return result[0].insertId;
  },

  getProtectedEntries: async () => {
    const db = await openDatabase();
    const results = await db.executeSql(
      'SELECT * FROM protected ORDER BY created_at DESC',
    );
    return results[0].rows.raw();
  },

  updateProtectedEntry: async entry => {
    const db = await openDatabase();
    const { title, content,date, id } = entry;
    const result = await db.executeSql(
      'UPDATE protected SET title = ?, content = ?,date=? WHERE id = ?',
      [title, content,date, id],
    );
    return result[0];
  },

  deleteProtectedEntry: async id => {
    const db = await openDatabase();
    const result = await db.executeSql('DELETE FROM protected WHERE id = ?', [
      id,
    ]);
    return result[0];
  },

  // code database
createLock: async entry => {
  const db = await openDatabase();
  const { code, question, answer } = entry;

  // Check if table has data
  const selectResult = await db.executeSql(
    'SELECT COUNT(*) as count FROM lock',
  );
  const count = selectResult[0].rows.item(0).count;

  const uuid = uuidv4();
  if (count === 0) {
    // Insert if empty
    await db.executeSql(
      'INSERT INTO lock (id, code, question, answer,synced) VALUES (?, ?, ?, ?,?)',
      [uuid, code, question, answer,0],
    );
    return { status: "inserted" };
  } else {
    // Update if already exists
    await db.executeSql(
      'UPDATE lock SET code = ?, question = ?, answer = ?',
      [code, question, answer]
    );
    return { status: "updated" };
  }
},


  getLock: async () => {
    const db = await openDatabase();
    const result = await db.executeSql('SELECT * FROM LOCK');
    return result[0].rows.raw();
  },

  checkCode: async code => {
    const db = await openDatabase();

    const result = await db.executeSql('SELECT * FROM LOCK WHERE code = ?', [
      code,
    ]);
    return result[0].rows.raw();
  },
};

const syncData = {
  getUnsync: async () => {
    try {
      const db = await openDatabase();
      const entriesSql = `
       SELECT * FROM entries WHERE synced = 0
       `;
      const entries = await db.executeSql(entriesSql);

      const eventsSql = `
       SELECT * FROM events WHERE synced = 0
       `;
      const events = await db.executeSql(eventsSql);

      const protectedSql = `
       SELECT * FROM protected WHERE synced = 0
       `;
      const protectedData = await db.executeSql(protectedSql);

      const lockSql = `
       SELECT * FROM lock WHERE synced = 0
       `;
      const lock = await db.executeSql(lockSql);

      return {
        entries: entries[0].rows.raw(),
        events: events[0].rows.raw(),
        protectedData: protectedData[0].rows.raw(),
        lock: lock[0].rows.raw(),
      };
    } catch (e) {
      console.log('Cannot get data for sync' + JSON.stringify(e, null, 2));
    }
  },

  setSync: async () => {
    try {
      const db = await openDatabase();
      const entriesSql = `
       UPDATE entries SET synced = 1
       `;
      const entries = await db.executeSql(entriesSql);

      const eventsSql = `
        UPDATE events SET synced = 1
        `;
      const events = await db.executeSql(eventsSql);

      const protectedSql = `
        UPDATE protected SET synced = 1
        `;
      const protectedData = await db.executeSql(protectedSql);

      const lockSql = `
       UPDATE lock SET synced = 1
       `;
      const lock = await db.executeSql(lockSql);

      return {
        entries: entries[0].rows.raw(),
        events: events[0].rows.raw(),
        protectedData: protectedData[0].rows.raw(),
        lock: lock[0].rows.raw(),
      };
    } catch (e) {
      console.log('Cannot get data for sync' + JSON.stringify(e, null, 2));
    }
  },

  checkDatabse: async () => {
    try {
      const db = await openDatabase();
      const tables = ['entries', 'events', 'protected', 'lock'];

      for (let table of tables) {
        const resultSet = await db.executeSql(
          `SELECT COUNT(*) as count FROM "${table}"`,
        );

        // In expo-sqlite or react-native-sqlite-storage:
        const count = resultSet[0].rows.item(0).count;

        if (count > 0) {
          return false; // one table has data
        }
      }

      return true; // all tables empty
    } catch (e) {
      console.log('Cannot check database: ' + e.message);
      return false; // fallback
    }
  },

  setDataOffline: async data => {
    const db = await openDatabase();
    if (data.entries && data.entries.length > 0) {
      data.entries.forEach(item => {
        db.executeSql(
          `INSERT OR REPLACE INTO entries (id, title, content, date, synced, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
          [item.id, item.title, item.content, item.date, 1, item.created_at],
        );
      });
    }
    if (data.events && data.events.length > 0) {
      data.events.forEach(item => {
        db.executeSql(
          `INSERT OR REPLACE INTO events (id, title, content, date, synced, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
          [item.id, item.title, item.content, item.date, 1, item.created_at],
        );
      });
    }
    if (data.protected && data.protected.length > 0) {
      data.protected.forEach(item => {
        db.executeSql(
          `INSERT OR REPLACE INTO protected (id, title, content, date, synced, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
          [item.id, item.title, item.content, item.date, 1, item.created_at],
        );
      });
    }
    if (data.lock && data.lock.length > 0) {
      data.lock.forEach(item => {
        db.executeSql(
           `INSERT OR REPLACE INTO lock (id, code, question, answer, synced, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [item.id, item.code, item.question, item.answer, 1, item.created_at]
        );
      });
    }
  },
};

export { initializeDatabase, DiaryRepository, syncData };
