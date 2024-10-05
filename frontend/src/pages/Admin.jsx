import React, { useState } from 'react';

const Admin = () => {
  // State for departments
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');

  // State for doctors
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '' });

  // State for billing
  const [bill, setBill] = useState({ patientName: '', services: '', amount: '' });
  const [bills, setBills] = useState([]);

  // Add department
  const handleAddDepartment = () => {
    if (newDepartment.trim() !== '') {
      setDepartments([...departments, newDepartment]);
      setNewDepartment('');
    }
  };

  // Delete department
  const handleDeleteDepartment = (index) => {
    const updatedDepartments = departments.filter((_, i) => i !== index);
    setDepartments(updatedDepartments);
  };

  // Add doctor
  const handleAddDoctor = () => {
    if (newDoctor.name.trim() !== '' && newDoctor.specialization.trim() !== '') {
      setDoctors([...doctors, newDoctor]);
      setNewDoctor({ name: '', specialization: '' });
    }
  };

  // Delete doctor
  const handleDeleteDoctor = (index) => {
    const updatedDoctors = doctors.filter((_, i) => i !== index);
    setDoctors(updatedDoctors);
  };

  // Generate Bill
  const handleGenerateBill = () => {
    if (bill.patientName && bill.services && bill.amount) {
      setBills([...bills, bill]);
      setBill({ patientName: '', services: '', amount: '' });
    }
  };

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
        <button onClick={handleAddDepartment}>Add Department</button>
        <ul>
          {departments.map((department, index) => (
            <li key={index}>
              {department}{' '}
              <button onClick={() => handleDeleteDepartment(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Manage Doctors */}
      <section className="doctors">
        <h2>Manage Doctors</h2>
        <input
          type="text"
          placeholder="Doctor Name"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Specialization"
          value={newDoctor.specialization}
          onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
        />
        <button onClick={handleAddDoctor}>Add Doctor</button>
        <ul>
          {doctors.map((doctor, index) => (
            <li key={index}>
              {doctor.name} - {doctor.specialization}{' '}
              <button onClick={() => handleDeleteDoctor(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Bill Generation */}
      <section className="bill-generation">
        <h2>Generate Bill</h2>
        <input
          type="text"
          placeholder="Patient Name"
          value={bill.patientName}
          onChange={(e) => setBill({ ...bill, patientName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Services Rendered"
          value={bill.services}
          onChange={(e) => setBill({ ...bill, services: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total Amount"
          value={bill.amount}
          onChange={(e) => setBill({ ...bill, amount: e.target.value })}
        />
        <button onClick={handleGenerateBill}>Generate Bill</button>
        <ul>
          {bills.map((bill, index) => (
            <li key={index}>
              {bill.patientName} - {bill.services} - ${bill.amount}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
