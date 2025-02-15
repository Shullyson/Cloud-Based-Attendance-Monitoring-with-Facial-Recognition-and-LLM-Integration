import axios from 'axios';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const BulkAddProgram = ({ handleClose }) => {
  const [programInputs, setProgramInputs] = useState(
    Array(5)
      .fill()
      .map(() => ({ name: '' }))
  );
  const [file, setFile] = useState(null);

  const handleInputChange = (index, field, value) => {
    setProgramInputs((prevInputs) =>
      prevInputs.map((prog, i) =>
        i === index ? { ...prog, [field]: value } : prog
      )
    );
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAddPrograms = () => {
    const validInputs = programInputs.filter((prog) => prog.name);
    if (validInputs.length === 0) {
      alert('Please provide at least one valid program.');
      return;
    }

    axios
      .post('http://127.0.0.1:5000/adminprograms/bulk', { programs: validInputs })
      .then(() => {
        alert('Programs added successfully');
        handleClose();
      })
      .catch((error) => console.error('Error adding programs:', error));
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

      const formattedData = data.map((row) => ({ name: row.ProgramName }));

      axios
        .post('http://127.0.0.1:5000/adminprograms/bulk', { programs: formattedData })
        .then(() => {
          alert('Programs added successfully');
          handleClose();
        })
        .catch((error) => console.error('Error adding programs:', error));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Bulk Add Programs</h2>
      <div>
        {programInputs.map((program, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Program Name"
              value={program.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddPrograms}>
          Add Programs
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Upload Excel File</h3>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="button" onClick={handleFileUpload}>
          Upload File
        </button>
      </div>
      <button type="button" onClick={handleClose}>
        Close
      </button>
    </div>
  );
};

BulkAddProgram.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default BulkAddProgram;
