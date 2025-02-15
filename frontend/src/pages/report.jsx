import 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/system';
import { AccountCircle } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Menu, Table, Paper, AppBar, Select, Button, Toolbar, MenuItem, TableRow, TableHead, TableCell, TableBody, Typography, IconButton } from '@mui/material';

import UPEClogo from 'src/components/logo/upec3.png';

const theme = createTheme({
  palette: {
    primary: { main: '#007bff' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f5f5' },
  },
});

const StyledPaper = styled(Paper)(({ theme: muiTheme }) => ({
  padding: muiTheme.spacing(3),
  marginBottom: muiTheme.spacing(3),
  borderRadius: muiTheme.shape.borderRadius,
}));

export default function ReportPage() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [professorName, setProfessorName] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [studentLogs, setStudentLogs] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [statistics, setStatistics] = useState({
    sessions: 0,
    present: 0,
    late: 0,
    absent: 0,
    totalScore: 0,
  });

  useEffect(() => {
    const loggedInProfessor = localStorage.getItem('loggedInProfessor');
    if (loggedInProfessor) {
      setProfessorName(loggedInProfessor);
      fetchInitialData(loggedInProfessor);
    }
  }, []);

  const fetchInitialData = async (professor) => {
    try {
      const courseResponse = await fetch(`http://127.0.0.1:5000/courses/${professor}`);
      const courseData = await courseResponse.json();
      setCourses(courseData.courses);

      const studentResponse = await fetch('http://127.0.0.1:5000/students');
      const studentList = await studentResponse.json();
      setStudents(studentList.students);

      const yearResponse = await fetch('http://127.0.0.1:5000/academic_years'); // Corrected route
      const yearData = await yearResponse.json();
      setAcademicYears(yearData.academicYears || []); // Match JSON key returned by backend
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let url = `http://127.0.0.1:5000/logs/${academicYear}`;
        const params = [];
        if (selectedStudent !== 'all') params.push(`student=${selectedStudent}`);
        if (selectedCourse !== 'all') params.push(`course=${selectedCourse}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        const response = await fetch(url);
        const data = await response.json();
        setStudentLogs(data.logs);
        calculateStatistics(data.logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    if (academicYear) fetchLogs();
  }, [academicYear, selectedStudent, selectedCourse]);

  const calculateStatistics = (logs) => {
    const sessions = logs.length;
    const present = logs.filter((log) => log.status === 'Present').length;
    const late = logs.filter((log) => log.status === 'Late').length;
    const absent = logs.filter((log) => log.status === 'Absent').length;
    const totalScore = logs.reduce((sum, log) => sum + log.score, 0);

    setStatistics({ sessions, present, late, absent, totalScore });
  };

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleDownloadPDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();
    doc.text(`Professor: ${professorName}`, 10, 10);
    doc.text(`Academic Year: ${academicYear}`, 10, 20);
    doc.text(`Selected Student: ${selectedStudent}`, 10, 30);
    doc.text(`Selected Course: ${selectedCourse}`, 10, 40);
  
    doc.autoTable({
      startY: 50,
      head: [['Date', 'Status', 'Score']],
      body: studentLogs.map((entry) => [entry.class_date, entry.status, entry.score]),
    });
  
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Sessions', 'Present', 'Late', 'Absent', 'Total Score']],
      body: [[statistics.sessions, statistics.present, statistics.late, statistics.absent, statistics.totalScore]],
    });
  
    doc.save('report.pdf');
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box>
        {/* AppBar */}
        <AppBar position="static">
  <Toolbar>
  <img src={UPEClogo} alt="UPEC Logo" style={{ height: 60, width: 150, marginRight: 25, marginLeft: 0, }} />
    {/* Clicking "Report Dashboard" navigates to the professor page */}
    <Typography
      variant="h6"
      sx={{ flexGrow: 1, cursor: 'pointer' }}
      onClick={() => navigate('/professor')}
    >
      Dashboard
    </Typography>
    <IconButton color="inherit" onClick={handleMenu}>
      <AccountCircle />
    </IconButton>
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
      <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
      <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
      <MenuItem
        onClick={() => {
          localStorage.removeItem('loggedInProfessor');
          navigate('/');
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  </Toolbar>
</AppBar>


        {/* Report Filters */}
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            Welcome, Professor {professorName}
          </Typography>
          <Box display="flex" gap={2} marginBottom={3}>
            <Select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">Select Academic Year</MenuItem>
              {academicYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="all">All Students</MenuItem>
              {students.map((student) => (
                <MenuItem key={student.Name} value={student.Name}>
                  {student.Name}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="all">All Courses</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </StyledPaper>

        {/* Report Table */}
        <StyledPaper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentLogs.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.class_date}</TableCell>
                  <TableCell>{entry.status}</TableCell>
                  <TableCell>{entry.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledPaper>

        {/* Statistics and Download */}
        <StyledPaper>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>
              Sessions: {statistics.sessions}, Present: {statistics.present}, Late: {statistics.late}, Absent:{' '}
              {statistics.absent}, Total Score: {statistics.totalScore}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </Box>
        </StyledPaper>
      </Box>
    </ThemeProvider>
  );
}

