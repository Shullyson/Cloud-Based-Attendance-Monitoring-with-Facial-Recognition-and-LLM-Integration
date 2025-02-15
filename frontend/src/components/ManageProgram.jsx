import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import 'src/components/style/admin.css';

const ManageProgram = ({ handleClose }) => {
    const [programs, setPrograms] = useState([]);
    const [newProgram, setNewProgram] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentProgram, setCurrentProgram] = useState({ id: null, name: '' });
  
    useEffect(() => {
      fetchPrograms();
    }, []);
  
    const fetchPrograms = () => {
      axios.get('http://127.0.0.1:5000/adminprograms')
        .then((response) => setPrograms(response.data))
        .catch((error) => console.error('Error fetching programs:', error));
    };
  
    const addProgram = () => {
      axios.post('http://127.0.0.1:5000/adminprograms', { program_name: newProgram })
        .then(() => {
          fetchPrograms();
          setNewProgram('');
        })
        .catch((error) => console.error('Error adding program:', error));
    };
  
    const updateProgram = (id, programName) => {
      axios.put(`http://127.0.0.1:5000/adminprograms/${id}`, { program_name: programName })
        .then(() => {
          fetchPrograms();
          setEditing(false);
          setCurrentProgram({ id: null, name: '' });
        })
        .catch((error) => console.error('Error updating program:', error));
    };
  
    const deleteProgram = (id) => {
      axios.delete(`http://127.0.0.1:5000/adminprograms/${id}`)
        .then(fetchPrograms)
        .catch((error) => console.error('Error deleting program:', error));
    };
  
    const handleSave = () => {
      if (editing) {
        updateProgram(currentProgram.id, newProgram);
      } else {
        addProgram();
      }
    };
  
    const handleEdit = (program) => {
      setEditing(true);
      setCurrentProgram({ id: program.ID, name: program.ProgramName });
      setNewProgram(program.ProgramName);
    };
  
    const handleCancel = () => {
      setEditing(false);
      setCurrentProgram({ id: null, name: '' });
      setNewProgram('');
      handleClose();
    };
  
    return (
      <div className="programs-container">
        <h2>Manage Programs</h2>
        <div className="form-container">
          <input
            type="text"
            placeholder="Program Name"
            value={newProgram}
            onChange={(e) => setNewProgram(e.target.value)}
          />
          <button type="button" onClick={handleSave}>
            {editing ? 'Update Program' : 'Add Program'}
          </button>
        </div>
        <ul className="programs-list">
          {programs.map((program) => (
            <li key={program.ID}>
              <span>{program.ProgramName}</span>
              <button type="button" onClick={() => handleEdit(program)}>
                Edit
              </button>
              <button type="button" onClick={() => deleteProgram(program.ID)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="modal-footer">
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  };
  
  ManageProgram.propTypes = {
    handleClose: PropTypes.func.isRequired,
  };
  
  export default ManageProgram;
