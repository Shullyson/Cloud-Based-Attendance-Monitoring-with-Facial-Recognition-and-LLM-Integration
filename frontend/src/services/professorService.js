// src/services/professorService.js
import axios from 'axios';

export const getProfessors = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/adminprofessors');
    return response.data;
  } catch (error) {
    console.error('Error fetching professors:', error);
    return [];
  }
};
