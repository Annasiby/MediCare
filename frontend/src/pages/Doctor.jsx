import React, { useState } from 'react';
import DatePicker from '../components/DatePicker';
import Appointment from '../components/Appointment';
import PatientRecord from '../components/PatientRecord';

const Doctor = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Doctor Dashboard</h1>
      
      <DatePicker setSelectedDate={setSelectedDate} />

      {selectedDate && (
        <div>
          <h2>Appointments on {selectedDate.toLocaleDateString('en-IN')}</h2>
          <Appointment 
            date={selectedDate} 
            setSelectedPatient={setSelectedPatient} 
          />
        </div>
      )}

      {selectedPatient && (
        <div>
          <h2>Patient Records</h2>
          <PatientRecord patientId={selectedPatient} />
        </div>
      )}
    </div>
  );
};

export default Doctor;
