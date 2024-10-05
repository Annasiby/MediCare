// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection

// Admin Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // SQL query to fetch the admin
    const sql = 'SELECT * FROM admins WHERE username = ? AND password = ?'; // Use Admin_name for username

    try {
        const [result] = await db.promise().query(sql, [username, password]);

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Respond with success message and admin information
        const admin = result[0]; // Assuming only one admin will be returned
        res.status(200).json({ 
            message: 'Logged in as admin',
            adminId: admin.Adm_ID, // Return the admin's ID
            adminName: `${admin.Admin_name}` // Return the admin's name
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router;