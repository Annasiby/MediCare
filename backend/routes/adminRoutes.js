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
// Adding department
router.post('/departments', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Department name is required' });
    }

    try {
        const query = 'INSERT INTO department (Dept_name) VALUES (?)';
        const [result] = await db.promise().query(query, [name]); // Use db.promise()
        res.status(200).json({ message: 'Department added successfully', result });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to add department' });
    }
});

// Adding doctor
router.post('/doctors', async (req, res) => {
    const { Dname, username, password, email, phone_no, department } = req.body; // Remove confirmPassword from backend

    try {
        // Check if the doctor already exists by username
        const [existingDoctor] = await db.promise().query('SELECT * FROM doctor WHERE username = ?', [username]);
        if (existingDoctor.length > 0) {
            return res.status(400).json({ message: "Doctor with this username already exists." });
        }

        // Get the Dept_ID based on the department name
        const [departmentResult] = await db.promise().query('SELECT Dept_ID FROM department WHERE Dept_name = ?', [department]);

        // Check if department exists
        if (departmentResult.length === 0) {
            return res.status(400).json({ message: "Department does not exist." });
        }

        const Dept_ID = departmentResult[0].Dept_ID;

        // Insert the new doctor into the database
        await db.promise().query(
            'INSERT INTO doctor (Dname, username, password, email, phone_no, Dept_ID) VALUES (?, ?, ?, ?, ?, ?)',
            [Dname, username, password, email, phone_no, Dept_ID]
        );

        res.status(201).json({ message: "Doctor added successfully!" });
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Fetch prescriptions based on patient ID and date
router.get('/prescriptions', async (req, res) => {
    const { patientId, date } = req.query;

    try {
        const [prescriptions] = await db.promise().query(
            'SELECT * FROM prescription WHERE Patient_ID = ? AND DATE(date) = ?',
            [patientId, date]
        );

        if (prescriptions.length === 0) {
            return res.status(404).json({ message: "No prescriptions found for this patient on the specified date." });
        }

        // Map through prescriptions to fetch related doctor and department details
        const prescriptionsWithDetails = await Promise.all(prescriptions.map(async (prescription) => {
            // Fetch doctor details
            const [doctor] = await db.promise().query('SELECT * FROM doctor WHERE DID = ?', [prescription.Doctor_ID]);
            const doctorName = doctor.length > 0 ? doctor[0].Dname : 'Unknown';

            // Fetch department details
            const [department] = await db.promise().query('SELECT * FROM department WHERE Dept_ID = ?', [doctor[0].Dept_ID]);
            const departmentName = department.length > 0 ? department[0].Dept_name : 'Unknown';

            return {
                ...prescription,
                doctor: doctorName,
                department: departmentName,
            };
        }));

        res.status(200).json(prescriptionsWithDetails);
    } catch (error) {
        res.status(500).json({ message: "Database error.", error: error.message });
    }
});
// Fetch prescription details by ID for bill generation
router.get('/prescriptions/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the prescription along with patient, doctor, department, and medicines details
        const [prescriptionDetails] = await db.promise().query(`
            SELECT 
                p.FName, 
                p.LName, 
                p.gender, 
                TIMESTAMPDIFF(YEAR, p.DOB, CURDATE()) AS age,  -- Calculate age from DOB
                d.Dname as doctor, 
                dept.Dept_name as department, 
                m.name as medicineName, 
                m.price
            FROM prescription AS pr
            JOIN patients AS p ON pr.Patient_ID = p.PID
            JOIN doctor AS d ON pr.Doctor_ID = d.DID
            JOIN department AS dept ON d.Dept_ID = dept.Dept_ID
            JOIN prescription_medicines AS pm ON pr.Pres_ID = pm.Pres_ID
            JOIN medicine AS m ON pm.Med_ID = m.Med_ID
            WHERE pr.Pres_ID = ?
        `, [id]);

        // Check if the prescription exists
        if (!prescriptionDetails || prescriptionDetails.length === 0) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        // Extract patient details from the first entry
        const patient = {
            FName: prescriptionDetails[0].FName,
            LName: prescriptionDetails[0].LName,
            gender: prescriptionDetails[0].gender,
            age: prescriptionDetails[0].age,
        };

        // Create a list of medicines
        const medicines = prescriptionDetails.map(med => ({
            name: med.medicineName,
            price: med.price,
        }));

        res.json({
            patient,
            doctor: prescriptionDetails[0].doctor,
            department: prescriptionDetails[0].department,
            medicines,
        });
    } catch (error) {
        console.error('Error fetching prescription details:', error);
        res.status(500).json({ error: 'Failed to fetch prescription details.' });
    }
});

router.post('/bills', (req, res) => {
  const { prescriptionId, totalAmount } = req.body;

  const query = `INSERT INTO bill (Pres_ID, tot_amnt) VALUES (?, ?)`;

  db.query(query, [prescriptionId, totalAmount], (err, result) => {
    if (err) {
      console.error('Error inserting bill:', err);
      return res.status(500).json({ error: 'Failed to add bill to the database' });
    }

    res.status(201).json({ message: 'Bill added successfully', billId: result.insertId });
  });
});


module.exports = router;