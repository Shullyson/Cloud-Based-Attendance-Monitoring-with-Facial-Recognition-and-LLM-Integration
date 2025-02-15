import axios from 'axios';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

const BulkAddCourses = ({ handleClose }) => {
  const [courseInputs, setCourseInputs] = useState(
    Array(5).fill().map(() => ({ course: '', professor: '', program: '' }))
  );
  const [file, setFile] = useState(null);
  const [programs, setPrograms] = useState([]);

  // Fetch programs for the dropdown
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/adminprograms')
      .then((response) => setPrograms(response.data))
      .catch((error) => console.error('Error fetching programs:', error));
  }, []);

  const handleInputChange = (index, field, value) => {
    setCourseInputs((prev) =>
      prev.map((course, i) => (i === index ? { ...course, [field]: value } : course))
    );
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAddCourses = () => {
    const validInputs = courseInputs.filter((course) => course.course && course.program);
    if (validInputs.length === 0) {
      alert('Please provide at least one valid course.');
      return;
    }
    axios
      .post('http://127.0.0.1:5000/admincourses/bulk', { courses: validInputs })
      .then(() => {
        alert('Courses added successfully');
        handleClose();
      })
      .catch((error) => console.error('Error adding courses:', error));
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
        course: row.Course,
        professor: row.Professor,
        program: row.Program,
      }));

      axios
        .post('http://127.0.0.1:5000/admincourses/bulk', { courses: formattedData })
        .then(() => {
          alert('Courses added successfully');
          handleClose();
        })
        .catch((error) => console.error('Error adding courses:', error));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Bulk Add Courses</h2>
      <div>
        {courseInputs.map((course, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Course"
              value={course.course}
              onChange={(e) => handleInputChange(index, 'course', e.target.value)}
            />
            <input
              type="text"
              placeholder="Professor"
              value={course.professor}
              onChange={(e) => handleInputChange(index, 'professor', e.target.value)}
            />
            <select
              value={course.program}
              onChange={(e) => handleInputChange(index, 'program', e.target.value)}
            >
              <option value="">- Select Program -</option>
              {programs.map((program) => (
                <option key={program.ID} value={program.ProgramName}>
                  {program.ProgramName}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="button" onClick={handleAddCourses}>
          Add Courses
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

BulkAddCourses.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default BulkAddCourses;
