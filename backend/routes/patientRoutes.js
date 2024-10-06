const express = require("express");
const router = express.Router();
const db = require("../db"); // Database connection

// 1. Patient Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // SQL query to fetch the user
  const sql = "SELECT * FROM patients WHERE username = ? AND password = ?";

  try {
    const [result] = await db.promise().query(sql, [username, password]);

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Respond with success message and patient information
    const patient = result[0];
    res.status(200).json({
      message: "Logged in as patient",
      patientId: patient.PID, // Return the patient's ID
      patientName: `${patient.FName} ${patient.LName}`, // Return the patient's name
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

//registration
router.post("/register", async (req, res) => {
  const {
    FName,
    LName,
    DOB,
    gender,
    phone_no,
    email,
    address,
    username,
    password,
  } = req.body;

  // Basic validation
  if (
    !FName ||
    !LName ||
    !DOB ||
    !gender ||
    !phone_no ||
    !email ||
    !address ||
    !username ||
    !password
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if the email or username already exists
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM patients WHERE email = ? OR username = ?", [
        email,
        username,
      ]);

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Email or username already exists." });
    }

    // Insert the new patient into the database
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO patients (FName, LName, DOB, gender, Phone_no, email, address, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          FName,
          LName,
          DOB,
          gender,
          phone_no,
          email,
          address,
          username,
          password,
        ]
      );

    // Respond with success message
    res.status(201).json({
      message: "Registration successful!",
      patientId: result.insertId,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
//profile details
router.get("/profile/:id", (req, res) => {
  const patientId = req.params.id;
  const query = `
      SELECT 
        CONCAT(FName, ' ', LName) AS name,
        gender,
        DOB,
        email,
        username,
        TIMESTAMPDIFF(YEAR, DOB, CURDATE()) AS age
      FROM 
        patients
      WHERE PID = ?`;

  db.query(query, [patientId], (error, results) => {
    if (error) {
      console.error("Error fetching patient details:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const patient = {
      ...results[0],
      age: results[0].age, // Add age calculated from DOB
    };
    res.json(patient);
  });
});

// Fetch all departments
router.get("/departments", (req, res) => {
  const query = "SELECT Dept_ID AS id, Dept_name AS name FROM department";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching departments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No departments found" });
    }

    // Map results to the desired structure if needed
    const departments = results.map((department) => ({
      id: department.id,
      name: department.name,
    }));

    res.json(departments);
  });
});

//get doctors
router.get("/doctors/:departmentId", (req, res) => {
  const departmentId = req.params.departmentId;

  const doctorQuery =
    "SELECT DID AS id, Dname AS name FROM doctor WHERE Dept_ID = ?";
  db.query(doctorQuery, [departmentId], (error, results) => {
    if (error) {
      console.error("Error fetching doctors:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No doctors found for this department" });
    }

    // Map results to the desired structure
    const doctors = results.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
    }));

    res.json(doctors);
  });
});

// Combined Route: Book an Appointment with Slot Check
router.post("/bookAppointment", async (req, res) => {
  const { patientId, department, doctor, date } = req.body;

  // Basic validation
  if (!patientId || !department || !doctor || !date) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Fetch doctor ID
    const doctorQuery = "SELECT DID FROM doctor WHERE Dname = ?";
    const [doctorRows] = await db.promise().query(doctorQuery, [doctor]);

    // Log the doctor result
    console.log("Doctor Query Result:", doctorRows);

    if (doctorRows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const doctorId = doctorRows[0].DID;

    // Count existing appointments for the doctor on the specified date
    const countQuery = `
          SELECT COUNT(*) as appointmentCount FROM appointments 
          WHERE Doctor_ID = ? AND DATE(Date) = ? 
        `;
    const [countRows] = await db.promise().query(countQuery, [doctorId, date]);

    // Log the count result
    console.log("Count Query Result:", countRows);

    if (countRows.length === 0) {
      return res
        .status(500)
        .json({ error: "Error retrieving appointment count" });
    }

    const appointmentCount = countRows[0].appointmentCount;

    // Check if the doctor can accept more appointments
    const MAX_SLOTS = 10;
    if (appointmentCount >= MAX_SLOTS) {
      return res.status(400).json({
        error:
          "Maximum appointment limit reached for this doctor on this date.",
      });
    }

    // Assign the next available token number
    const tokenNo = appointmentCount + 1; // Token numbers start from 1

    // Insert the appointment
    const insertQuery = `
          INSERT INTO appointments (Patient_ID, Doctor_ID, token_no, Date, Status) 
          VALUES (?, ?, ?, ?, 'Approved')
        `;
    const [insertResult] = await db
      .promise()
      .query(insertQuery, [patientId, doctorId, tokenNo, date]);

    // Ensure that the insert was successful
    if (insertResult.affectedRows === 0) {
      return res.status(500).json({ error: "Failed to book appointment" });
    }

    // Respond with success message including the appointment date and token number
    res.json({
      message: "Appointment booked successfully!",
      appointmentDate: date, // Include the date of the appointment
      tokenNo: tokenNo, // Return the correct token number
    });
  } catch (error) {
    console.error("Error in booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

// Route 6: Fetch Appointment History for a Patient
router.get("/appointments", async (req, res) => {
  const { patientId, date } = req.query;

  // Basic validation
  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required." });
  }

  try {
    // Base query to fetch appointments with a join to get the doctor name
    let query = `
          SELECT 
            a.AppID AS id, 
            a.Date AS date, 
            d.Dname AS doctor, 
            a.Status AS status
          FROM appointments a
          JOIN doctor d ON a.Doctor_ID = d.DID
          WHERE a.Patient_ID = ?
        `;

    const params = [patientId];

    // Optional date filtering
    if (date) {
      query += " AND DATE(a.Date) = ?";
      params.push(date);
    }

    // Execute the query
    const [rows] = await db.promise().execute(query, params);

    // Respond with appointment data or a message if none found
    if (rows.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointment history." });
  }
});

module.exports = router;
