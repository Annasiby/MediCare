// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection

// Doctor Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // SQL query to fetch the doctor
    const sql = 'SELECT * FROM doctor WHERE username = ? AND password = ?';

    try {
        const [result] = await db.promise().query(sql, [username, password]);

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Respond with success message and doctor information
        const doctor = result[0]; // Assuming only one doctor will be returned
        res.status(200).json({ 
            message: 'Logged in as doctor',
            doctorId: doctor.DID, // Return the doctor's ID
            doctorName: `${doctor.Dname}` // Return the doctor's name
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
