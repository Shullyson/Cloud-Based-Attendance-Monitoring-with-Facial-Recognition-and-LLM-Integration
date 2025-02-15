import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';

import 'src/components/style/admin.css';

const ManageStudents = ({ handleClose }) => {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', studentNumber: '', password: '', program: '' });
  const [editing, setEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ id: null, name: '', studentNumber: '', password: '', program: '' });

  const fetchStudents = useCallback(() => {
    axios.get('http://127.0.0.1:5000/adminstudents')
      .then((response) => setStudents(response.data))
      .catch((error) => console.error('Error fetching students:', error));
  }, []);

  const fetchPrograms = useCallback(() => {
    axios.get('http://127.0.0.1:5000/adminprograms')
      .then((response) => setPrograms(response.data))
      .catch((error) => console.error('Error fetching programs:', error));
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchPrograms();
  }, [fetchStudents, fetchPrograms]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editing) {
      setCurrentStudent({ ...currentStudent, [name]: value });
    } else {
      setNewStudent({ ...newStudent, [name]: value });
    }
  };

  const handleSave = () => {
    if (editing) {
      axios.put(`http://127.0.0.1:5000/adminstudents/${currentStudent.id}`, currentStudent)
        .then(fetchStudents)
        .catch((error) => console.error('Error updating student:', error));
      setEditing(false);
    } else if (newStudent.name && newStudent.studentNumber && newStudent.password && newStudent.program) {
      axios.post('http://127.0.0.1:5000/adminstudents', newStudent)
        .then(fetchStudents)
        .catch((error) => console.error('Error adding student:', error));
    }
    handleClose();
  };

  const deleteStudent = (id) => {
    axios.delete(`http://127.0.0.1:5000/adminstudents/${id}`)
      .then(fetchStudents)
      .catch((error) => console.error('Error deleting student:', error));
  };

  const editStudent = (student) => {
    setEditing(true);
    setCurrentStudent({
      id: student.ID,
      name: student.Name,
      studentNumber: student.StudentNumber,
      password: student.Password,
      program: student.Program,
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setCurrentStudent({ id: null, name: '', studentNumber: '', password: '', program: '' });
    handleClose();
  };

  return (
    <div className="students-container">
      <h2>Manage Students</h2>
      <div className="form-container">
        <input
          className="form-input"
          type="text"
          name="name"
          placeholder="Name"
          value={editing ? currentStudent.name : newStudent.name}
          onChange={handleInputChange}
        />
        <input
          className="form-input"
          type="text"
          name="studentNumber"
          placeholder="Student Number"
          value={editing ? currentStudent.studentNumber : newStudent.studentNumber}
          onChange={handleInputChange}
        />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={editing ? currentStudent.password : newStudent.password}
          onChange={handleInputChange}
        />
        <select
          className="form-select"
          name="program"
          value={editing ? currentStudent.program : newStudent.program}
          onChange={handleInputChange}
        >
          <option value="">-Select Program-</option>
          {programs.map((program) => (
            <option key={program.ID} value={program.ProgramName}>
              {program.ProgramName}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleSave}>
          {editing ? 'Update Student' : 'Add Student'}
        </button>
      </div>
      <ul className="students-list">
        {students.map((student) => (
          <li key={student.ID}>
            <span>{student.Name}</span>
            <span>{student.StudentNumber}</span>
            <span>{student.Program}</span>
            <button type="button" onClick={() => editStudent(student)}>
              Edit
            </button>
            <button type="button" onClick={() => deleteStudent(student.ID)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="modal-footer">
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

ManageStudents.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default ManageStudents;
