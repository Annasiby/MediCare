import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PatientDashboard = () => {
  const [patient, setPatient] = useState({});
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [slotError, setSlotError] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const location = useLocation();
  const patientId = new URLSearchParams(location.search).get("ID");

  useEffect(() => {
    if (patientId) {
      loadPatientDetails();
      loadDepartments();
      loadAppointmentHistory();
    }
  }, [patientId]);

  const loadPatientDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/patient/profile/${patientId}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/patient/departments"
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const departmentsData = await response.json();
      setDepartments(departmentsData);
      if (departmentsData.length > 0)
        setSelectedDepartment(departmentsData[0]?.id);
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setDoctors([]);
        if (selectedDepartment) {
          const response = await fetch(
            `http://localhost:3000/api/patient/doctors/${selectedDepartment}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const doctorsData = await response.json();
          setDoctors(doctorsData);
          if (doctorsData.length > 0) setSelectedDoctor(doctorsData[0]?.name);
          else setSelectedDoctor("");
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
      }
    };
    fetchDoctors();
  }, [selectedDepartment]);

  const bookAppointment = async () => {
    if (selectedDepartment && selectedDoctor && selectedDate) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/patient/bookAppointment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patientId,
              department: selectedDepartment,
              doctor: selectedDoctor,
              date: selectedDate,
            }),
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();

        alert(
          result.message +(result.appointmentDate? `  Date: ${result.appointmentDate}  ` : "" )+
            (result.tokenNo ? ` Your token number is ${result.tokenNo}.` : "")
        );
        loadAppointmentHistory();
      } catch (error) {
        console.error("Error booking appointment:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options); // Adjust locale if needed
  };

  const loadAppointmentHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/patient/appointments?patientId=${patientId}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const appointmentsData = await response.json();
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointment history:", error);
    }
  };

  const filterAppointments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/patient/appointments?patientId=${patientId}&date=${filterDate}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const filteredAppointments = await response.json();
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error("Error filtering appointments:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="greeting text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600">
          Hello, <span className="text-blue-800">{patient.name}</span>!
        </h1>
      </div>

      <div className="tabs flex justify-center mb-6">
        <button
          className="Patient-Buttons"
          onClick={() => setActiveTab("profile")}
        >
          View Profile
        </button>
        <button
          className="Patient-Buttons"
          onClick={() => setActiveTab("book")}
        >
          Book Appointment
        </button>
        <button
          className="Patient-Buttons"
          onClick={() => setActiveTab("history")}
        >
          Appointment History
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="tab-content">
          <div className="profile-container p-4 bg-gray-100 rounded">
            <h2 className="text-2xl mb-4">Patient Profile</h2>
            <img
              src="PATIENTICON.png"
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <p>
              <strong>Name:</strong> {patient.name}
            </p>
            <p>
              <strong>Gender:</strong> {patient.gender}
            </p>
            <p>
              <strong>Age:</strong> {patient.age}
            </p>
            <p>
              <strong>Username:</strong> {patient.username}
            </p>
            <p>
              <strong>Email:</strong> {patient.email}
            </p>
          </div>
        </div>
      )}

      {activeTab === "book" && (
        <div className="tab-content">
          <div className="booking-container p-4 bg-gray-100 rounded">
            <h2 className="text-2xl mb-4">Book an Appointment</h2>
            <div className="mb-4">
              <label htmlFor="department" className="block mb-2">
                Select Department:
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="doctor" className="block mb-2">
                Select Doctor:
              </label>
              <select
                id="doctor"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={doctors.length === 0}
              >
                {doctors.length === 0 ? (
                  <option value="">No doctors available</option>
                ) : (
                  doctors.map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block mb-2">
                Select Date:
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button onClick={bookAppointment} className="Patient-Buttons">
              Book Appointment
            </button>
            {slotError && (
              <p className="text-red-600 mt-2">
                Selected slot is not available. Please try another.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="tab-content">
          <div className="history-container p-4 bg-gray-100 rounded">
            <h2 className="text-2xl mb-4">Appointment History</h2>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
            />
            <button onClick={filterAppointments} className="Patient-Buttons">
              Filter Appointments
            </button>
            {appointments.map((appointment) => (
              <div key={appointment.id} className="mb-4 p-2 border rounded">
                <p>
                  <strong>Date:</strong> {formatDate(appointment.date)}
                </p>
                <p>
                  <strong>Doctor:</strong> {appointment.doctor}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
