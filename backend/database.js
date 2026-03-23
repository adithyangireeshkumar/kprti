const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL -- 'ADMIN' or 'OFFICER'
  );

  CREATE TABLE IF NOT EXISTS FIRs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_date TEXT NOT NULL,
    location TEXT NOT NULL,
    complainant_name TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'Open', -- 'Open', 'Under Investigation', 'Closed'
    officer_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (officer_id) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fir_id INTEGER NOT NULL,
    status TEXT DEFAULT 'Under Investigation',
    assigned_officer_id INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fir_id) REFERENCES FIRs(id),
    FOREIGN KEY (assigned_officer_id) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Criminals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dob TEXT,
    identifying_marks TEXT,
    history TEXT,
    photo_url TEXT
  );

  CREATE TABLE IF NOT EXISTS Criminal_Cases (
    criminal_id INTEGER,
    case_id INTEGER,
    PRIMARY KEY (criminal_id, case_id),
    FOREIGN KEY (criminal_id) REFERENCES Criminals(id),
    FOREIGN KEY (case_id) REFERENCES Cases(id)
  );

  CREATE TABLE IF NOT EXISTS News (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'Pending Review', -- 'Pending Review', 'Approved'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
