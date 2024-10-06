import React, { useEffect, useState } from 'react';
import { fetchAppointmentsByDate } from '../services/api'; // Change to fetchAppointmentsByDate

const Appointment = ({ date, setSelectedPatient }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (date) { // Check if date is not null
        const response = await fetchAppointmentsByDate(date); // Use the correct API function
        setAppointments(response);
      }
    };

    fetchAppointments();
  }, [date]);

  return (
    <div>
      {appointments.length === 0 ? (
        <p>No appointments for this date.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} onClick={() => setSelectedPatient(appointment.patientId)}>
              {appointment.time} - {appointment.patientName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Appointment;