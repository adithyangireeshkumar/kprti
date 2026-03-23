const express = require('express');
const router = express.Router();
const db = require('../database');

// FIRs
router.get('/firs', (req, res) => {
    const firs = db.prepare('SELECT * FROM FIRs ORDER BY created_at DESC').all();
    res.json(firs);
});
router.post('/firs', (req, res) => {
    const { incident_date, location, complainant_name, description } = req.body;
    const stmt = db.prepare('INSERT INTO FIRs (incident_date, location, complainant_name, description) VALUES (?, ?, ?, ?)');
    const info = stmt.run(incident_date, location, complainant_name, description);
    res.json({ id: info.lastInsertRowid });
});

// Cases
router.get('/cases', (req, res) => {
    const cases = db.prepare(`SELECT Cases.*, FIRs.description as fir_desc FROM Cases JOIN FIRs ON Cases.fir_id = FIRs.id`).all();
    res.json(cases);
});

router.post('/cases', (req, res) => {
    const { fir_id, assigned_officer_id, notes } = req.body;
    const stmt = db.prepare('INSERT INTO Cases (fir_id, assigned_officer_id, notes) VALUES (?, ?, ?)');
    const info = stmt.run(fir_id, assigned_officer_id || null, notes || '');
    
    // Also update FIR status
    db.prepare("UPDATE FIRs SET status = 'Under Investigation' WHERE id = ?").run(fir_id);
    res.json({ id: info.lastInsertRowid });
});

router.put('/cases/:id/close', (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE Cases SET status = 'Closed' WHERE id = ?").run(id);
    const fir_id = db.prepare("SELECT fir_id FROM Cases WHERE id = ?").get(id)?.fir_id;
    if (fir_id) db.prepare("UPDATE FIRs SET status = 'Closed' WHERE id = ?").run(fir_id);
    res.json({ success: true });
});

// Criminals
router.get('/criminals', (req, res) => {
    const criminals = db.prepare('SELECT * FROM Criminals').all();
    res.json(criminals);
});
router.post('/criminals', (req, res) => {
    const { name, dob, identifying_marks, history, photo_url } = req.body;
    const stmt = db.prepare('INSERT INTO Criminals (name, dob, identifying_marks, history, photo_url) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(name, dob, identifying_marks, history, photo_url);
    res.json({ id: info.lastInsertRowid });
});

// Officers & Users
router.get('/officers', (req, res) => {
    const officers = db.prepare("SELECT * FROM Users WHERE role = 'OFFICER'").all();
    res.json(officers);
});

router.post('/seed', (req, res) => {
    // Seed some logic
    try {
        db.prepare("INSERT INTO Users (username, password, role) VALUES ('admin', 'admin', 'ADMIN')").run();
        db.prepare("INSERT INTO Users (username, password, role) VALUES ('officer_smith', 'pass', 'OFFICER')").run();
        res.json({ success: true });
    } catch (e) {
        res.json({ error: e.message });
    }
});

// News
router.get('/news', (req, res) => {
    const news = db.prepare('SELECT * FROM News ORDER BY created_at DESC').all();
    res.json(news);
});

router.post('/news', (req, res) => {
    const { title, content } = req.body;
    const stmt = db.prepare('INSERT INTO News (title, content) VALUES (?, ?)');
    const info = stmt.run(title, content);
    res.json({ id: info.lastInsertRowid });
});

router.put('/news/:id/approve', (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE News SET status = 'Approved' WHERE id = ?").run(id);
    res.json({ success: true });
});

// Analytics
router.get('/analytics', (req, res) => {
    const totalFirs = db.prepare('SELECT COUNT(*) as count FROM FIRs').get()?.count || 0;
    const activeCases = db.prepare("SELECT COUNT(*) as count FROM Cases WHERE status = 'Under Investigation'").get()?.count || 0;
    const closedCases = db.prepare("SELECT COUNT(*) as count FROM Cases WHERE status = 'Closed'").get()?.count || 0;
    const pendingNews = db.prepare("SELECT COUNT(*) as count FROM News WHERE status = 'Pending Review'").get()?.count || 0;
    
    // Recent activities (just top 5 FIRs for chart)
    const recentFirs = db.prepare('SELECT date(created_at) as date, COUNT(*) as count FROM FIRs GROUP BY date(created_at) ORDER BY date DESC LIMIT 7').all();
    
    res.json({ totalFirs, activeCases, closedCases, pendingNews, recentFirs });
});

module.exports = router;
