import axios from 'axios';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const BulkAddStudents = ({ handleClose }) => {
  const [studentInputs, setStudentInputs] = useState(
    Array(5).fill().map(() => ({ name: '', studentNumber: '', password: '', program: '' }))
  );
  const [file, setFile] = useState(null);

  const handleInputChange = (index, field, value) => {
    setStudentInputs((prevInputs) =>
      prevInputs.map((input, i) => (i === index ? { ...input, [field]: value } : input))
    );
  };

  const handleAddStudents = () => {
    const validInputs = studentInputs.filter(student => student.name && student.studentNumber && student.password && student.program);
    if (validInputs.length === 0) {
      alert('Please provide at least one valid student.');
      return;
    }

    axios.post('http://127.0.0.1:5000/adminstudents/bulk', { students: validInputs })
      .then(() => {
        alert('Students added successfully');
        handleClose();
      })
      .catch(error => console.error('Error adding students:', error));
  };

  const handleFileUpload = () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const formattedData = data.map(row => ({
        name: row.Name,
        studentNumber: row.StudentNumber,
        password: row.Password,
        program: row.Program,
      }));

      axios.post('http://127.0.0.1:5000/adminstudents/bulk', { students: formattedData })
        .then(() => {
          alert('Students added successfully');
          handleClose();
        })
        .catch(error => console.error('Error adding students:', error));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Bulk Add Students</h2>
      <div>
        {studentInputs.map((student, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Name"
              value={student.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Student Number"
              value={student.studentNumber}
              onChange={(e) => handleInputChange(index, 'studentNumber', e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={student.password}
              onChange={(e) => handleInputChange(index, 'password', e.target.value)}
            />
            <select
              value={student.program}
              onChange={(e) => handleInputChange(index, 'program', e.target.value)}
            >
              <option value="">-Select Program-</option>
              <option value="M1, Biometrics">M1, Biometrics</option>
              <option value="M2, Biometrics">M2, Biometrics</option>
              <option value="Erasmus Mobility">Erasmus Mobility</option>
              <option value="PSRS Erasmus Mundus">PSRS Erasmus Mundus</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={handleAddStudents}>
          Add Students
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Upload Excel File</h3>
        <input type="file" accept=".xlsx, .xls" onChange={(e) => setFile(e.target.files[0])} />
        <button type="button" onClick={handleFileUpload}>
          Upload File
        </button>
      </div>
      <button type="button" onClick={handleClose} style={{ marginTop: '20px' }}>
        Close
      </button>
    </div>
  );
};

BulkAddStudents.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default BulkAddStudents;
