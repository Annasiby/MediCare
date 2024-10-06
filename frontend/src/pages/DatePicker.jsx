import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import enIN from 'date-fns/locale/en-IN';
import { format } from 'date-fns';

registerLocale('en-IN', enIN);

const DatePicker = ({ setSelectedDate }) => {
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Select a Date</h3>
      <ReactDatePicker
        selected={null} // Change this to a controlled component
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        locale="en-IN"
        placeholderText="Choose a date"
      />
    </div>
  );
};

export default DatePicker;