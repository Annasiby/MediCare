import React, { useEffect, useState } from 'react';
import { getPatientRecord, updatePatientPrescription } from '../services/api';

const medicinesList = [
  { name: 'Paracetamol', price: 10 },
  { name: 'Ibuprofen', price: 15 },
  { name: 'Amoxicillin', price: 25 },
  { name: 'Cetirizine', price: 12 }
]; // Sample medicines list with prices

const PatientRecord = ({ patientId }) => {
  const [patientRecord, setPatientRecord] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchPatientRecord = async () => {
      const response = await getPatientRecord(patientId);
      setPatientRecord(response);
    };

    fetchPatientRecord();
  }, [patientId]);

  const handleMedicineSelect = (e) => {
    const selectedMedicine = medicinesList.find(
      (medicine) => medicine.name === e.target.value
    );
    
    if (selectedMedicine && !selectedMedicines.some(medicine => medicine.name === selectedMedicine.name)) {
      setSelectedMedicines([...selectedMedicines, selectedMedicine]);
      setTotalAmount(totalAmount + selectedMedicine.price);
    }
  };

  const handleDeleteMedicine = (medicineName) => {
    const updatedMedicines = selectedMedicines.filter(medicine => medicine.name !== medicineName);
    const deletedMedicine = selectedMedicines.find(medicine => medicine.name === medicineName);

    setSelectedMedicines(updatedMedicines);
    setTotalAmount(totalAmount - (deletedMedicine ? deletedMedicine.price : 0));
  };

  const handleSubmit = async () => {
    const updatedPrescription = {
      medicines: selectedMedicines.map((medicine) => medicine.name),
      remarks,
      totalAmount
    };

    await updatePatientPrescription(patientId, updatedPrescription);

    setPatientRecord({
      ...patientRecord,
      prescription: updatedPrescription,
      invoice: { total: totalAmount, date: new Date().toLocaleDateString('en-IN') }
    });

    setIsEditing(false); // Exit edit mode
  };

  if (!patientRecord) {
    return <p>Loading patient record...</p>;
  }

  return (
    <div>
      <h3>Prescription</h3>
      {isEditing ? (
        <div>
          <h4>Select Medicine</h4>
          <select onChange={handleMedicineSelect} defaultValue="">
            <option value="" disabled>Select medicine</option>
            {medicinesList.map((medicine) => (
              <option key={medicine.name} value={medicine.name}>
                {medicine.name} - ₹{medicine.price}
              </option>
            ))}
          </select>

          <div>
            <h4>Selected Medicines</h4>
            <ul>
              {selectedMedicines.map((medicine) => (
                <li key={medicine.name}>
                  {medicine.name} - ₹{medicine.price}
                  <button onClick={() => handleDeleteMedicine(medicine.name)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>

          <h4>Remarks</h4>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            cols={50}
            placeholder="Add any remarks here"
          />

          <h4>Total Amount: ₹{totalAmount}</h4>
          
          <button onClick={handleSubmit}>Save Prescription</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Medicines: {patientRecord.prescription.medicines.join(', ')}</p>
          <p>Remarks: {patientRecord.prescription.remarks}</p>
        </div>
      )}

      <h3>Invoice</h3>
      <p>Total: ₹{new Intl.NumberFormat('en-IN').format(patientRecord.invoice.total)}</p>
      <p>Date: {patientRecord.invoice.date}</p>
      <button onClick={() => setIsEditing(true)}>Edit Prescription</button>
    </div>
  );
};

export default PatientRecord;