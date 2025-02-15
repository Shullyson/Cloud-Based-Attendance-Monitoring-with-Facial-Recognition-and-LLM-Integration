import axios from 'axios';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const BulkAddProfessors = ({ handleClose }) => {
  const [professorInputs, setProfessorInputs] = useState(
    Array(5)
      .fill()
      .map(() => ({ name: '', password: '', permission: 'Granted' }))
  );
  const [file, setFile] = useState(null);

  const handleInputChange = (index, field, value) => {
    setProfessorInputs((prevInputs) =>
      prevInputs.map((prof, i) =>
        i === index ? { ...prof, [field]: value } : prof
      )
    );
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAddProfessors = () => {
    const validInputs = professorInputs.filter(
      (prof) => prof.name && prof.password
    );
    if (validInputs.length === 0) {
      alert('Please provide at least one valid professor.');
      return;
    }

    axios
      .post('http://127.0.0.1:5000/adminprofessors/bulk', { professors: validInputs })
      .then(() => {
        alert('Professors added successfully');
        handleClose();
      })
      .catch((error) => console.error('Error adding professors:', error));
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

      const formattedData = data.map((row) => ({
        name: row.Name,
        password: row.Password,
        permission: row.Permission || 'Granted',
      }));

      axios
        .post('http://127.0.0.1:5000/adminprofessors/bulk', { professors: formattedData })
        .then(() => {
          alert('Professors added successfully');
          handleClose();
        })
        .catch((error) => console.error('Error adding professors:', error));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Bulk Add Professors</h2>
      <div>
        {professorInputs.map((professor, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Name"
              value={professor.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={professor.password}
              onChange={(e) =>
                handleInputChange(index, 'password', e.target.value)
              }
            />
            <select
              value={professor.permission}
              onChange={(e) =>
                handleInputChange(index, 'permission', e.target.value)
              }
            >
              <option value="Granted">Granted</option>
              <option value="Denied">Denied</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={handleAddProfessors}>
          Add Professors
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Upload Excel File</h3>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="button" onClick={handleFileUpload}>
          Upload File
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

BulkAddProfessors.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default BulkAddProfessors;

