const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection

// 1. Patient Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // SQL query to fetch the user
    const sql = 'SELECT * FROM patients WHERE username = ? AND password = ?';

    try {
        const [result] = await db.promise().query(sql, [username, password]);

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Respond with success message and patient information
        const patient = result[0];
        res.status(200).json({ 
            message: 'Logged in as patient',
            patientId: patient.PID, // Return the patient's ID
            patientName: `${patient.FName} ${patient.LName}` // Return the patient's name
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

//registration 
router.post('/register', async (req, res) => {
    const { FName, LName, DOB, gender, phone_no, email, address, username, password } = req.body;

    // Basic validation
    if (!FName || !LName || !DOB || !gender || !phone_no || !email || !address || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check if the email or username already exists
        const [existingUser] = await db.promise().query('SELECT * FROM patients WHERE email = ? OR username = ?', [email, username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email or username already exists.' });
        }

        // Insert the new patient into the database
        const [result] = await db.promise().query(
            'INSERT INTO patients (FName, LName, DOB, gender, Phone_no, email, address, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [FName, LName, DOB, gender, phone_no, email, address, username, password]
        );

        // Respond with success message
        res.status(201).json({ message: 'Registration successful!', patientId: result.insertId });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
// 3. Book an Appointment
router.post('/appointments', (req, res) => {
    const { Patient_ID, Doctor_Name, Dept_Name, Date } = req.body;

    // Fetch Doctor ID based on Doctor_Name and Dept_Name
    const fetchDoctorSql = `SELECT DID FROM doctor WHERE Dname = ? AND Dept_ID = (SELECT Dept_ID FROM department WHERE Dept_name = ?)`;
    
    db.query(fetchDoctorSql, [Doctor_Name, Dept_Name], (err, doctorResult) => {
        if (err || doctorResult.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        const Doctor_ID = doctorResult[0].DID;

        // Fetch existing appointments for the doctor on that date
        const fetchTokenNoSql = `
            SELECT COUNT(*) as count FROM appointments 
            WHERE Doctor_ID = ? AND DATE(Date) = DATE(?)`;
        
        db.query(fetchTokenNoSql, [Doctor_ID, Date], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching appointment count' });
            }

            const count = result[0].count;
            
            // Check if token_no exceeds 20
            if (count >= 20) {
                return res.status(400).json({ error: 'Maximum appointment limit reached for this doctor on this date' });
            }

            const token_no = count + 1; // Assigning token_no

            // Insert the appointment with status as 'Approved'
            const sql = `INSERT INTO appointments (token_no, Patient_ID, Doctor_ID, Date, Status) VALUES (?, ?, ?, ?, 'Approved')`;
            
            db.query(sql, [token_no, Patient_ID, Doctor_ID, Date], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error booking appointment' });
                }
                res.status(200).json({ message: 'Appointment booked successfully', token_no });
            });
        });
    });
});

// 4. Get Appointments
router.get('/appointments', (req, res) => {
    const { date } = req.query; // Expecting a date parameter

    let sql = `
        SELECT a.token_no, a.Date, d.Dname AS Doctor_Name, dep.Dept_name AS Department_Name, a.Status 
        FROM appointments a 
        JOIN doctor d ON a.Doctor_ID = d.DID 
        JOIN department dep ON d.Dept_ID = dep.Dept_ID`;
    
    if (date) {
        sql += ' WHERE DATE(a.Date) = ?';
    }

    db.query(sql, [date], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching appointments' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
