import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Alert,       // Import Alert for Snackbar
  Paper,
  Table,
  AppBar,
 
  Button,
  
  Select,
  Toolbar,
  MenuItem,
  Snackbar,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  
 

} from '@mui/material';

export default function ProfessorPage() {
  const navigate = useNavigate();
  const [professorName, setProfessorName] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [startTime, setStartTime] = useState('');
  const [acceptedDelay, setAcceptedDelay] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const loggedInProfessor = localStorage.getItem('loggedInProfessor');
    if (loggedInProfessor) {
      setProfessorName(loggedInProfessor);

      // Fetch courses
      fetch(`http://127.0.0.1:5000/courses/${loggedInProfessor}`)
        .then((response) => response.json())
        .then((data) => setCourses(data.courses))
        .catch((error) => console.error('Error fetching courses:', error));
    }
  }, []);

  const handleFaceRecognition = () => {
    setSnackbarOpen(true); // Show feedback
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Professor Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/report')}>
            Reports
          </Button>
          <Button color="inherit" onClick={() => navigate('/')}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ padding: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Welcome, {professorName}</Typography>
            <Select
              fullWidth
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              displayEmpty
              sx={{ marginTop: 2 }}
            >
              <MenuItem value="">
                <em>Select Course</em>
              </MenuItem>
              {courses.map((course, index) => (
                <MenuItem key={index} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
            <TextField
              type="time"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              sx={{ marginTop: 2 }}
            />
            <TextField
              type="number"
              fullWidth
              value={acceptedDelay}
              onChange={(e) => setAcceptedDelay(e.target.value)}
              sx={{ marginTop: 2 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Attendance Records
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Attendance Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Map over student data here */}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Grid container justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleFaceRecognition}>
            Start Face Recognition
          </Button>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Face recognition started!
        </Alert>
      </Snackbar>
    </div>
  );
}
