import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';

import 'src/components/style/admin.css';

const ManageCourses = ({ handleClose }) => {
    const [courses, setCourses] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [newCourse, setNewCourse] = useState({ course: '', professor: '', program: '' });
    const [editing, setEditing] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({ id: null, course: '', professor: '', program: '' });
  
    const fetchCourses = useCallback(() => {
      axios.get('http://127.0.0.1:5000/admincourses')
        .then(response => setCourses(response.data))
        .catch(error => console.error('Error fetching courses:', error));
    }, []);
  
    const fetchPrograms = useCallback(() => {
      axios.get('http://127.0.0.1:5000/adminprograms')
        .then(response => setPrograms(response.data))
        .catch(error => console.error('Error fetching programs:', error));
    }, []);
  
    useEffect(() => {
      fetchCourses();
      fetchPrograms();
    }, [fetchCourses, fetchPrograms]);
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      if (editing) {
        setCurrentCourse({ ...currentCourse, [name]: value });
      } else {
        setNewCourse({ ...newCourse, [name]: value });
      }
    };
  
    const handleSave = () => {
      if (editing) {
        axios.put(`http://127.0.0.1:5000/admincourses/${currentCourse.id}`, currentCourse)
          .then(() => fetchCourses())
          .catch(error => console.error('Error updating course:', error));
        setEditing(false);
      } else {
        axios.post('http://127.0.0.1:5000/admincourses', newCourse)
          .then(() => fetchCourses())
          .catch(error => console.error('Error adding course:', error));
      }
      handleClose();
    };
  
    const handleEdit = (course) => {
      setEditing(true);
      setCurrentCourse({ id: course.ID, course: course.Course, professor: course.Professor, program: course.ProgramName });
    };
  
    const handleDelete = (id) => {
      axios.delete(`http://127.0.0.1:5000/admincourses/${id}`)
        .then(() => fetchCourses())
        .catch(error => console.error('Error deleting course:', error));
    };
  
    return (
      <div className="courses-container">
        <h2>Manage Courses</h2>
        <div className="form-container">
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={editing ? currentCourse.course : newCourse.course}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="professor"
            placeholder="Professor"
            value={editing ? currentCourse.professor : newCourse.professor}
            onChange={handleInputChange}
          />
          <select
            name="program"
            value={editing ? currentCourse.program : newCourse.program}
            onChange={handleInputChange}
          >
            <option value="">-Select Program-</option>
            {programs.map(program => (
              <option key={program.ID} value={program.ProgramName}>{program.ProgramName}</option>
            ))}
          </select>
          <button type="button" onClick={handleSave}>
            {editing ? 'Update Course' : 'Add Course'}
          </button>
        </div>
        <ul className="courses-list">
          {courses.map(course => (
            <li key={course.ID}>
              <span>{course.Course}</span>
              <span>{course.Professor}</span>
              <span>{course.ProgramName}</span>
              <button type="button" onClick={() => handleEdit(course)}>Edit</button>
              <button type="button" onClick={() => handleDelete(course.ID)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  ManageCourses.propTypes = {
    handleClose: PropTypes.func.isRequired,
  };
  
  export default ManageCourses;