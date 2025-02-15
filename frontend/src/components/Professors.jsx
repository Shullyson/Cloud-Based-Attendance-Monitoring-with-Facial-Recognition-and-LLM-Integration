import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';

import 'src/components/style/admin.css';



const Professors = ({ handleClose }) => {
  const [professors, setProfessors] = useState([]);
  const [newProfessor, setNewProfessor] = useState({ name: '', password: '', permission: 'Granted' });
  const [editing, setEditing] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState({ id: null, name: '', password: '', permission: 'Granted' });

  const fetchProfessors = useCallback(() => {
    axios.get('http://127.0.0.1:5000/adminprofessors')
      .then(response => setProfessors(response.data))
      .catch(error => console.error('Error fetching professors:', error));
  }, []);

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editing) {
      setCurrentProfessor({ ...currentProfessor, [name]: value });
    } else {
      setNewProfessor({ ...newProfessor, [name]: value });
    }
  };

  const handleSave = () => {
    if (editing) {
      axios.put(`http://127.0.0.1:5000/adminprofessors/${currentProfessor.id}`, currentProfessor)
        .then(fetchProfessors)
        .catch(error => console.error('Error updating professor:', error));
      setEditing(false);
    } else if (newProfessor.name && newProfessor.password) {
      axios.post('http://127.0.0.1:5000/adminprofessors', newProfessor)
        .then(fetchProfessors)
        .catch(error => console.error('Error adding professor:', error));
    }
    handleClose();
  };

  const deleteProfessor = (id) => {
    axios.delete(`http://127.0.0.1:5000/adminprofessors/${id}`)
      .then(fetchProfessors)
      .catch(error => console.error('Error deleting professor:', error));
  };

  const editProfessor = (professor) => {
    setEditing(true);
    setCurrentProfessor({
      id: professor.ID,
      name: professor.Name,
      password: professor.Password,
      permission: professor.Permision
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setCurrentProfessor({ id: null, name: '', password: '', permission: 'Granted' });
    handleClose();
  };

  return (
    <div className="professors-container">
      <h2>Manage Professors</h2>
      <div className="form-container">
        <input
          className='form-input'
          type="text"
          name="name"
          placeholder="Name"
          value={editing ? currentProfessor.name : newProfessor.name}
          onChange={handleInputChange}
        />
        <input
          className='form-input'
          type="password"
          name="password"
          placeholder="Password"
          value={editing ? currentProfessor.password : newProfessor.password}
          onChange={handleInputChange}
        />
        <select
          className='form-select'
          name="permission"
          value={editing ? currentProfessor.permission : newProfessor.permission}
          onChange={handleInputChange}
        >
          <option value="Granted">Granted</option>
          <option value="Denied">Denied</option>
        </select>
        <button type="button" onClick={handleSave}>{editing ? 'Update Professor' : 'Add Professor'}</button>
      </div>
      <ul className="professors-list">
        {professors.map((professor) => (
          <li key={professor.ID}>
            <span>{professor.Name}</span>
            <span>{professor.Permision}</span>
            <button type="button" onClick={() => editProfessor(professor)}>Edit</button>
            <button type="button" onClick={() => deleteProfessor(professor.ID)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="modal-footer">
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

Professors.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default Professors;
