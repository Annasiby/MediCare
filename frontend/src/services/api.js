import { format } from 'date-fns';

// Mocking API requests
export const fetchAppointmentsByDate = async (selectedDate) => {
  const mockData = [
    { id: 1, date: '2024-10-06', patientId: 1, patientName: 'John Doe', time: '10:00 AM' },
    { id: 2, date: '2024-10-07', patientId: 2, patientName: 'Jane Doe', time: '11:00 AM' }
  ];

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const filteredAppointments = mockData.filter(
    (appointment) => appointment.date === formattedDate
  );

  return filteredAppointments;
};

export const getPatientRecord = async (patientId) => {
  // Mocking patient records based on patientId
  const patientRecords = {
    1: {
      prescription: {
        medicines: ['Paracetamol', 'Ibuprofen'],
        remarks: 'Take 1 tablet every 6 hours for fever',
      },
      invoice: {
        total: 25,
        date: '06-10-2024',
      },
    },
    2: {
      prescription: {
        medicines: ['Amoxicillin', 'Cetirizine'],
        remarks: 'Take 1 tablet for infection',
      },
      invoice: {
        total: 37,
        date: '07-10-2024',
      },
    },
  };

  // Return the appropriate record based on patientId
  return patientRecords[patientId] || null; // Default to null if no record found
};

// Mocked API for updating patient's prescription
export const updatePatientPrescription = async (patientId, updatedPrescription) => {
  console.log(`Updated Prescription for Patient ${patientId}:`, updatedPrescription);
  return true;
};
