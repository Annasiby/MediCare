/*import React from 'react'

const Patient = () => {
  return (
    <div>
      patient
    </div>
  )
}

export default Patient*/
import React, { useEffect, useState } from 'react';

const PatientDashboard = () => {
    const [patient, setPatient] = useState({});
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [slotError, setSlotError] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const patientId = 1; // Simulated patient ID

    useEffect(() => {
        loadPatientDetails();
        loadDepartments();
    }, []);

    const loadPatientDetails = async () => {
        try {
            const response = await fetch(`/api/patient/${patientId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setPatient(data);
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    const loadDepartments = async () => {
        try {
            const response = await fetch('/api/departments');
            if (!response.ok) throw new Error('Network response was not ok');
            const departmentsData = await response.json();
            setDepartments(departmentsData);
            setSelectedDepartment(departmentsData[0]?.name);
        } catch (error) {
            console.error("Error loading departments:", error);
        }
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            if (selectedDepartment) {
                try {
                    const response = await fetch(`/api/doctors?department=${selectedDepartment}`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const doctorsData = await response.json();
                    setDoctors(doctorsData);
                    setSelectedDoctor(doctorsData[0]?.name);
                } catch (error) {
                    console.error("Error loading doctors:", error);
                }
            }
        };
        fetchDoctors();
    }, [selectedDepartment]);

    const bookAppointment = async () => {
        if (selectedDepartment && selectedDate && selectedDoctor) {
            try {
                const response = await fetch(`/api/checkSlots?doctor=${selectedDoctor}&date=${selectedDate}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const slotAvailability = await response.json();

                if (!slotAvailability.isAvailable) {
                    setSlotError(true);
                } else {
                    setSlotError(false);
                    const bookingResponse = await fetch(`/api/bookAppointment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ patientId, department: selectedDepartment, date: selectedDate, doctor: selectedDoctor }),
                    });
                    if (bookingResponse.ok) {
                        alert('Appointment booked successfully!');
                    } else {
                        alert('Failed to book appointment. Please try again.');
                    }
                }
            } catch (error) {
                console.error("Error checking slot availability or booking appointment:", error);
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    const filterAppointments = async () => {
        try {
            const response = await fetch(`/api/appointments?patientId=${patientId}&date=${filterDate}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const appointmentsData = await response.json();
            setAppointments(appointmentsData);
        } catch (error) {
            console.error("Error fetching appointment history:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="greeting text-center mb-6">
                <h1 className="text-4xl font-bold text-blue-600">Hello, <span className="text-blue-800">{patient.name}</span>!</h1>
            </div>

            <div className="tabs flex justify-center mb-6">
                <button className={`tab-link px-4 py-2 mx-2 rounded ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`} onClick={() => setActiveTab('profile')}>
                    View Profile
                </button>
                <button className={`tab-link px-4 py-2 mx-2 rounded ${activeTab === 'book' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`} onClick={() => setActiveTab('book')}>
                    Book Appointment
                </button>
                <button className={`tab-link px-4 py-2 mx-2 rounded ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`} onClick={() => setActiveTab('history')}>
                    Appointment History
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="tab-content">
                    <div className="profile-container p-4 bg-gray-100 rounded">
                        <h2 className="text-2xl mb-4">Patient Profile</h2>
                        <img src="PATIENTICON.png" alt="Profile Picture" className="w-24 h-24 rounded-full mb-4" />
                        <p><strong>Name:</strong> {patient.name}</p>
                        <p><strong>Gender:</strong> {patient.gender}</p>
                        <p><strong>Age:</strong> {patient.age}</p>
                        <p><strong>Username:</strong> {patient.username}</p>
                        <p><strong>Email:</strong> {patient.email}</p>
                    </div>
                </div>
            )}

            {/* Booking Tab */}
            {activeTab === 'book' && (
                <div className="tab-content">
                    <div className="booking-container p-4 bg-gray-100 rounded">
                        <h2 className="text-2xl mb-4">Book an Appointment</h2>
                        <label htmlFor="department">Select Department:</label>
                        <select id="department" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="mb-4 border p-2 rounded">
                            {departments.map(department => (
                                <option key={department.id} value={department.name}>{department.name}</option>
                            ))}
                        </select>
                        <div classname="mb-4">
                        <label htmlFor="date">Select Date:</label>
                        <input type="date" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="mb-4 border p-2 rounded" required />
                        </div>
                        <label htmlFor="doctor">Select Doctor:</label>
                        <select id="doctor" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="mb-4 border p-2 rounded">
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                            ))}
                        </select>
                        <div classname="mb-4">
                        <button type="button" onClick={bookAppointment} className="bg-blue-600 text-white px-4 py-2 rounded">Book Appointment</button>
                        {slotError && <p className="text-red-600 mt-2">Sorry, the appointments for the day have been filled. Please select a different date or, in case of emergency, contact the hospital.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="tab-content">
                    <div className="history-container p-4 bg-gray-100 rounded">
                        <h2 className="text-2xl mb-4">Appointment History</h2>
                        <label htmlFor="filter-date">Filter by Date:</label>
                        <input type="date" id="filter-date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="mb-4 border p-2 rounded" />

                        <button onClick={filterAppointments} className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>

                        <ul className="mt-4">
                            {appointments.map(appointment => (
                                <li key={appointment.id} className="mb-2">{appointment.doctor} - {appointment.date}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;

