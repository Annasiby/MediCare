import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import axios from "axios";

const Admin = () => {
  // State for departments
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");

  // State for doctors
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    Dname: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone_no: "",
    department: "",
  });

  // State for prescriptions and bill generation
  const [bill, setBill] = useState({ patientId: "", date: "" });
  const [prescriptions, setPrescriptions] = useState([]);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/departments"
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/doctors"
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Add department to the backend
  const handleAddDepartment = async () => {
    if (newDepartment.trim() !== "") {
      try {
        await axios.post("http://localhost:3000/api/admin/departments", {
          name: newDepartment,
        });
        fetchDepartments(); // Refresh the list of departments
        setNewDepartment("");
        alert("Department added successfully!");
      } catch (error) {
        console.error("Error adding department:", error);
        alert("Failed to add department.");
      }
    } else {
      alert("Please enter a department name.");
    }
  };

  // Add doctor to the backend
  const handleAddDoctor = async () => {
    const {
      Dname,
      username,
      password,
      confirmPassword,
      email,
      phone_no,
      department,
    } = newDoctor;

    if (
      !Dname ||
      !username ||
      !password ||
      !confirmPassword ||
      !email ||
      !phone_no ||
      !department
    ) {
      return alert("Please fill out all fields.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      await axios.post("http://localhost:3000/api/admin/doctors", {
        Dname,
        username,
        password,
        email,
        phone_no,
        department,
      });
      fetchDoctors(); // Refresh the list of doctors
      alert("Doctor added successfully!");
      setNewDoctor({
        Dname: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone_no: "",
        department: "",
      });
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Failed to add doctor.");
    }
  };

  // Fetch prescriptions based on patient ID and date
  const handleFetchPrescriptions = async () => {
    if (bill.patientId && bill.date) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/admin/prescriptions?patientId=${bill.patientId}&date=${bill.date}`
        );
        setPrescriptions(response.data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        alert("Failed to fetch prescriptions.");
      }
    } else {
      alert("Please enter both Patient ID and Date.");
    }
  };

  // Generate a bill as PDF
  const handleGenerateBill = async (prescriptionId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/prescriptions/${prescriptionId}`
      );
      const { patient, doctor, department, medicines } = response.data;
  
      const doc = new jsPDF();
  
      // Hospital Header
      doc.setFontSize(18);
      doc.text(20, 20, "XYZ Hospital");
      doc.setFontSize(12);
      doc.text(20, 30, "123 Main Street, City, Country");
      doc.text(20, 35, "Phone: (123) 456-7890 | Email: contact@xyzhospital.com");
  
      // Horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, 40, 190, 40);
  
      // Patient Info
      doc.setFontSize(14);
      doc.text(20, 50, "Patient Information:");
      doc.setFontSize(12);
      doc.text(20, 60, `Name: ${patient.FName} ${patient.LName}`);
      doc.text(20, 65, `Age: ${patient.age}`);
      doc.text(20, 70, `Gender: ${patient.gender}`);
  
      // Doctor & Department Info
      doc.setFontSize(14);
      doc.text(20, 80, "Doctor Information:");
      doc.setFontSize(12);
      doc.text(20, 90, `Doctor: ${doctor}`);
      doc.text(20, 95, `Department: ${department}`);
  
      // Horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, 100, 190, 100);
  
      // Medicines Table Header
      doc.setFontSize(14);
      doc.text(20, 110, "Prescribed Medicines:");
      doc.setFontSize(12);
      doc.text(20, 120, "No.");
      doc.text(40, 120, "Medicine");
      doc.text(140, 120, "Price (Rs.)");
  
      // Medicines Table Content
      let total = 0;
      medicines.forEach((med, index) => {
        doc.text(20, 130 + index * 10, `${index + 1}`);
        doc.text(40, 130 + index * 10, med.name);
        doc.text(140, 130 + index * 10, `Rs.${med.price}`);
        total += parseFloat(med.price);
      });
  
      // Horizontal line for total
      const lastMedPosition = 130 + medicines.length * 10;
      doc.setLineWidth(0.5);
      doc.line(20, lastMedPosition + 10, 190, lastMedPosition + 10);
  
      // Total Price
      doc.setFontSize(14);
      doc.text(20, lastMedPosition + 20, `Total Price: Rs.${total.toFixed(2)}`);
  
      // Footer with disclaimer
      doc.setFontSize(10);
      doc.text(
        20,
        280,
        "This is a computer-generated bill. Please contact XYZ Hospital for any discrepancies."
      );
      doc.text(20, 285, "Thank you for choosing XYZ Hospital!");
  
      // Save the PDF
      doc.save(`bill_${patient.FName}_${patient.LName}_${prescriptionId}.pdf`);
      await axios.post("http://localhost:3000/api/admin/bills", {
        prescriptionId,
        totalAmount: total.toFixed(2),
      });

      alert("Bill generated and saved to the database successfully!");
    } catch (error) {
      console.error("Error generating bill:", error);
      alert("Failed to generate bill.");
    }
  };
  

  useEffect(() => {
    fetchDepartments(); // Initial fetch of departments
    fetchDoctors(); // Initial fetch of doctors
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Manage Departments */}
      <section className="departments">
        <h2>Manage Departments</h2>
        <input
          type="text"
          placeholder="Enter department name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
        />
        <button onClick={handleAddDepartment} className="button1">
          Add Department
        </button>
        <ul>
          {departments.map((department, index) => (
            <li key={index}>{department.name} </li>
          ))}
        </ul>
      </section>

      {/* Manage Doctors */}
      <section className="doctors">
        <h2>Manage Doctors</h2>
        <input
          type="text"
          placeholder="Doctor Name"
          value={newDoctor.Dname}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, Dname: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Username"
          value={newDoctor.username}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={newDoctor.password}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, password: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={newDoctor.confirmPassword}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, confirmPassword: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={newDoctor.email}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone No"
          value={newDoctor.phone_no}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, phone_no: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Department"
          value={newDoctor.department}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, department: e.target.value })
          }
        />
        <button onClick={handleAddDoctor} className="button1">
          Add Doctor
        </button>
      </section>

      {/* Fetch Prescriptions */}
      <section className="prescriptions">
        <h2>Fetch Prescriptions</h2>
        <input
          type="text"
          placeholder="Patient ID"
          value={bill.patientId}
          onChange={(e) => setBill({ ...bill, patientId: e.target.value })}
        />
        <input
          type="date"
          placeholder="Date"
          value={bill.date}
          onChange={(e) => setBill({ ...bill, date: e.target.value })}
        />
        <button onClick={handleFetchPrescriptions} className="button1">
          Fetch Prescriptions
        </button>

        {prescriptions.length > 0 && (
          <div>
            <h3>Prescriptions:</h3>
            <ul className="prescription-list">
              {prescriptions.map((prescription) => (
                <li key={prescription.Pres_ID} className="prescription-item">
                  <div className="prescription-details">
                    <span>
                      <strong>Prescription ID:</strong> {prescription.Pres_ID}
                    </span>
                    <span style={{ margin: "0 10px" }}>|</span>{" "}
                    {/* Add a separator with space */}
                    <span>
                      <strong>Doctor:</strong> {prescription.doctor}
                    </span>
                    <span style={{ margin: "0 10px" }}>|</span>{" "}
                    {/* Add a separator with space */}
                    <span>
                      <strong>Department:</strong> {prescription.department}
                    </span>
                  </div>
                  <button
                    onClick={() => handleGenerateBill(prescription.Pres_ID)}
                    className="button1"
                  >
                    Generate Bill
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;
