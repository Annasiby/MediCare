import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import "../index.css"; // Ensure you have this CSS file for styling

// Helper function to calculate age from DOB
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const DoctorPage = () => {
  const [doctorDetails, setDoctorDetails] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patients, setPatients] = useState([]);
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const location = useLocation();

  const doctorID = new URLSearchParams(location.search).get("ID");

  // Fetch doctor details
  const fetchDoctorDetails = async () => {
    console.log("Fetching doctor details for ID:", doctorID); // Debug log
    try {
      const response = await axios.get(
        `http://localhost:3000/api/doctor/details/${doctorID}`
      );
      console.log("Doctor details fetched successfully:", response.data); // Debug log
      setDoctorDetails(response.data);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  // Fetch appointments by date
  const fetchAppointments = async () => {
    if (!appointmentDate) {
      console.error("Appointment date is not selected.");
      return; // Exit if no date is selected
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/doctor/appointments/${doctorID}?date=${appointmentDate}`
      );
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch all medicines (with optional search term)
  const fetchMedicines = async (search = "") => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/doctor/medicines?search=${search}`
      );
      setMedicines(response.data.medicines);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  // Add diagnosis and prescription
  const handleAddPrescription = async () => {
    if (
      !selectedAppointment ||
      !newDiagnosis ||
      selectedMedicines.length === 0
    ) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/doctor/addPrescription`,
        {
          patientID: selectedAppointment.Patient_ID,
          doctorID: doctorID,
          diagnosis: newDiagnosis,
          medicines: selectedMedicines.map((med) => med.value), // Tracking Med_IDs
          appointmentDate: selectedAppointment.Date,
        }
      );

      alert("Prescription added successfully");
      setNewDiagnosis("");
      setSelectedMedicines([]);
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };

  // Complete appointment
  const handleCompleteAppointment = async () => {
    if (!selectedAppointment) {
      alert("No appointment selected.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/api/doctor/completeAppointment/${selectedAppointment.AppID}`
      );
      alert("Appointment marked as completed");
      fetchAppointments(appointmentDate); // Refresh appointments after completion
      setSelectedAppointment(null); // Clear selected appointment after completion
    } catch (error) {
      console.error("Error marking appointment as completed:", error);
      alert("Failed to mark appointment as completed. Please try again.");
    }
  };

  // Remove a selected medicine
  const removeMedicine = (medicineID) => {
    setSelectedMedicines((prevSelected) =>
      prevSelected.filter((med) => med.value !== medicineID)
    );
  };

  // Fetch doctor details on mount
  useEffect(() => {
    if (doctorID) {
      fetchDoctorDetails();
    }
  }, [doctorID]);

  // Fetch medicines whenever search term changes
  useEffect(() => {
    fetchMedicines(searchTerm);
  }, [searchTerm]);

  return (
    <div className="doctor-page">
      <h1 className="page-title">Doctor's Dashboard</h1>

      {/* Doctor Details */}
      <div className="doctor-info-box">
        <h2>Doctor Details</h2>
        <p>
          <strong>ID:</strong> {doctorDetails.DID}
        </p>
        <p>
          <strong>Name:</strong> {doctorDetails.Dname}
        </p>
        <p>
          <strong>Department:</strong> {doctorDetails.Dept_name}
        </p>
      </div>

      <div className="appointment-date-selector">
        <h2>Select Appointment Date</h2>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => {
            setAppointmentDate(e.target.value);
          }}
          className="date-input"
        />
        <button
          onClick={fetchAppointments}
          className="fetch-appointments-button"
        >
          Fetch Appointments
        </button>
      </div>

      {/* Appointments */}
      <div className="appointments-list">
        <h2>Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments found for the selected date.</p>
        ) : (
          <ul>
            {appointments.map((appointment) => (
              <li
                key={appointment.AppID}
                onClick={() => setSelectedAppointment(appointment)}
                className="appointment-item"
              >
                Token No: {appointment.token_no}, Patient Name:{" "}
                {appointment.patientFullName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Prescription Section */}
      {selectedAppointment && (
        <div className="prescription-section">
          <h3>Patient Details</h3>
          <div className="patient-details">
            <p>
              <strong>Name:</strong> {selectedAppointment.patientFullName}
            </p>
            <p>
              <strong>ID:</strong> {selectedAppointment.Patient_ID}
            </p>
            <p>
              <strong>DOB:</strong>{" "}
              {new Date(selectedAppointment.DOB).toLocaleDateString("en-GB")}
            </p>

            <p>
              <strong>Age:</strong> {calculateAge(selectedAppointment.DOB)}
            </p>
            <p>
              <strong>Gender:</strong> {selectedAppointment.gender}
            </p>
          </div>

          <h4>Add Diagnosis</h4>
          <textarea
            value={newDiagnosis}
            onChange={(e) => setNewDiagnosis(e.target.value)}
            placeholder="Enter diagnosis"
            className="diagnosis-textarea"
          />

          <div>
            <h4>Select Medicines</h4>
            <Select
              options={medicines.map((med) => ({
                value: med.Med_ID,
                label: med.name,
              }))}
              onInputChange={(value) => {
                setSearchTerm(value);
                fetchMedicines(value); // Fetch medicines when input changes
              }}
              value={selectedMedicines} // Bind selected medicines to the dropdown
              onChange={(selectedOptions) => {
                setSelectedMedicines(selectedOptions); // Set selected medicines directly
              }}
              isMulti
              className="medicine-select"
            />

            {/* Display selected medicines */}
            <div className="selected-medicines">
              {selectedMedicines.map((medicine) => (
                <div key={medicine.value} className="medicine-box">
                  {medicine.label}
                  <button
                    onClick={() => removeMedicine(medicine.value)}
                    className="remove-medicine-button"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="prescription-actions">
            <button onClick={handleAddPrescription} className="action-button">
              Add Prescription
            </button>
            <button
              onClick={handleCompleteAppointment}
              className="action-button"
            >
              Mark Appointment as Completed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPage;
