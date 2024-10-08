// routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // Database connection

// Doctor Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // SQL query to fetch the doctor
  const sql = "SELECT * FROM doctor WHERE username = ? AND password = ?";

  try {
    const [result] = await db.promise().query(sql, [username, password]);

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Respond with success message and doctor information
    const doctor = result[0]; // Assuming only one doctor will be returned
    res.status(200).json({
      message: "Logged in as doctor",
      doctorId: doctor.DID, // Return the doctor's ID
      doctorName: `${doctor.Dname}`, // Return the doctor's name
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/details/:id", async (req, res) => {
  const doctorID = req.params.id;

  try {
    const query = `
        SELECT 
          d.DID, 
          d.Dname, 
          dept.Dept_name 
        FROM doctor d
        LEFT JOIN department dept ON d.Dept_ID = dept.Dept_ID
        WHERE d.DID = ?`;

    const [rows] = await db.promise().execute(query, [doctorID]);

    if (rows.length === 0) {
      console.warn("Doctor not found for ID:", doctorID); // Debug log
      return res.status(404).json({ error: "Doctor not found." });
    }

    res.json(rows[0]); // Sending the doctor details along with the department name
  } catch (err) {
    console.error("Error fetching doctor details:", err);
    res.status(500).json({ error: "Failed to fetch doctor details." });
  }
});

// Fetch appointments for a doctor by date
router.get("/appointments/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  // Basic validation
  if (!doctorId) {
    return res.status(400).json({ error: "Doctor ID is required." });
  }

  try {
    let query = `
        SELECT 
          a.AppID, 
          a.Patient_ID, 
          a.token_no, 
          CONCAT(p.FName, ' ', p.LName) AS patientFullName, 
          p.DOB, 
          p.gender,
          a.Date,
          a.Status
        FROM appointments a
        JOIN patients p ON a.Patient_ID = p.PID
        WHERE a.Doctor_ID = ?
      `;

    const params = [doctorId];

    // Optional date filtering
    if (date) {
      query += " AND DATE(a.Date) = ?";
      params.push(date);
    }

    const [rows] = await db.promise().execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.json({ appointments: rows });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
});

// Fetch all medicines with an optional search term
router.get("/medicines", async (req, res) => {
  const { search } = req.query;
  try {
    let query = "SELECT Med_ID, name FROM medicine";
    const params = [];
    if (search) {
      query += " WHERE name LIKE ?";
      params.push(`%${search}%`);
    }
    const [rows] = await db.promise().execute(query, params);
    console.log("Fetched medicines:", rows); // Log the medicines fetched
    res.json({ medicines: rows });
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ error: "Failed to fetch medicines." });
  }
});

// Add diagnosis and prescription
router.post("/addPrescription", async (req, res) => {
  const { patientID, doctorID, diagnosis, medicines, appointmentDate } =
    req.body;

  // Basic validation
  if (!patientID || !doctorID || !diagnosis || !medicines.length) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Insert the prescription
    const [prescriptionResult] = await db
      .promise()
      .execute(
        "INSERT INTO prescription (Patient_ID, Doctor_ID, diagnosis, date) VALUES (?, ?, ?, NOW())",
        [patientID, doctorID, diagnosis]
      );

    const presID = prescriptionResult.insertId;

    // Insert associated medicines
    for (const medID of medicines) {
      await db
        .promise()
        .execute(
          "INSERT INTO prescription_medicines (Pres_ID, Med_ID) VALUES (?, ?)",
          [presID, medID]
        );
    }

    res.json({ message: "Prescription added successfully." });
  } catch (err) {
    console.error("Error adding prescription:", err);
    res.status(500).json({ error: "Failed to add prescription." });
  }
});

router.post("/completeAppointment/:appointmentID", async (req, res) => {
    const { appointmentID } = req.params; // Get appointmentID from URL
  
    // Basic validation
    if (!appointmentID) {
      return res.status(400).json({ error: "Appointment ID is required." });
    }
  
    try {
      const [result] = await db
        .promise()
        .execute('UPDATE appointments SET Status = "Completed" WHERE AppID = ?', [
          appointmentID,
        ]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Appointment not found." });
      }
  
      res.json({ message: "Appointment marked as completed." });
    } catch (err) {
      console.error("Error marking appointment as completed:", err);
      res.status(500).json({ error: "Failed to mark appointment as completed." });
    }
  });
  
module.exports = router;
