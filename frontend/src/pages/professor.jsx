import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/system';
import { AccountCircle } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Menu, Table,AppBar, Select, Button, Toolbar, MenuItem, TableRow, TextField,TableHead, TableCell, TableBody, Typography, IconButton } from '@mui/material';

import UPEClogo from 'src/images/upec_logo.png'; 

const theme = createTheme({
  palette: {
    primary: { main: "#007bff" },
    secondary: { main: "#f50057" },
  },
});

// Styled component
const StyledPaper = styled(Box)(({ theme: muiTheme }) => ({
  padding: muiTheme.spacing(3),
  marginBottom: muiTheme.spacing(3),
  borderRadius: muiTheme.shape.borderRadius,
  backgroundColor: "#fff",
}));

export default function ProfessorPage() {
  const navigate = useNavigate();
  const [professorName, setProfessorName] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [acceptedDelay, setAcceptedDelay] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const loggedInProfessor = localStorage.getItem("loggedInProfessor");
    if (loggedInProfessor) {
      setProfessorName(loggedInProfessor);
      fetchCourses(loggedInProfessor);
    }
  }, []);

  const fetchCourses = async (professor) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/courses/${professor}`);
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudentData = async (course) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/students/${course}`);
      const data = await response.json();
      setStudentData(data.students || []);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleCourseChange = (event) => {
    const course = event.target.value;
    setSelectedCourse(course);
    if (course) fetchStudentData(course);
  };

  const handleAttendanceChange = async (index, newStatus) => {
    const updatedData = [...studentData];
    updatedData[index].delayTime = newStatus;

    try {
      const response = await fetch("http://127.0.0.1:5000/update_delay_time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: updatedData[index].name,
          delay_time: newStatus,
        }),
      });

      if (response.ok) {
        setStudentData(updatedData);
        alert(`Updated status for ${updatedData[index].name} to ${newStatus}`);
      } else {
        alert("Failed to update attendance status.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const startFaceRecognition = async () => {
    if (!startTime || !acceptedDelay) {
      alert("Please enter both Start Time and Accepted Delay!");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/start_face_recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_time: startTime,
          accepted_delay: acceptedDelay,
        }),
      });

      if (response.ok) {
        alert("Face recognition started!");

        // Poll for updates
        const id = setInterval(async () => {
          const updatedResponse = await fetch(`http://127.0.0.1:5000/students/${selectedCourse}`);
          if (updatedResponse.ok) {
            const updatedData = await updatedResponse.json();
            setStudentData(updatedData.students);
          }
        }, 5000);

        setIntervalId(id);
      } else {
        alert("Failed to start face recognition.");
      }
    } catch (error) {
      console.error("Error starting face recognition:", error);
    }
  };

  const startOnlineAttendance = async () => {
    try {
        const response = await fetch("http://localhost:5000/zoom/create-meeting", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            const { join_url, password } = await response.json();

            // Redirect to the Zoom meeting link
            window.location.href = join_url;

            // Optionally, you can store meeting details for further use
            console.log("Meeting Password:", password);
        } else {
            alert("Failed to create Zoom meeting");
        }
    } catch (error) {
        console.error("Error starting online attendance:", error);
        alert("An error occurred while starting online attendance.");
    }
};


  const navigateToReport = () => navigate("/report");

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <img src={UPEClogo} alt="UPEC Logo" style={{ height: 50,width: 130, marginRight: 20 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Professor Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem onClick={() => navigate("/professor")}>Profile</MenuItem>
              <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("loggedInProfessor");
                  navigate("/");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            Welcome, Professor {professorName}
          </Typography>
          <Box display="flex" alignItems="center" gap={2} marginBottom={3}>
            <Typography>Select Course:</Typography>
            <Select
              value={selectedCourse}
              onChange={handleCourseChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">Select Course</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              type="time"
              label="Start Time"
              value={startTime || ""}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
            />
            <TextField
              type="number"
              label="Accepted Delay (min)"
              value={acceptedDelay || ""}
              onChange={(e) => setAcceptedDelay(e.target.value)}
              fullWidth
            />
          </Box>
        </StyledPaper>

        <StyledPaper>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
            <Typography variant="h6">Student Attendance</Typography>
            <Box>
              <Button variant="contained" color="primary" onClick={startFaceRecognition}>
                ONSITE
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={startOnlineAttendance}
                sx={{ marginLeft: 2 }}
              >
                ONLINE
              </Button>
              <Button
                variant="outlined"
                onClick={navigateToReport}
                sx={{ marginLeft: 2 }}
              >
                View Reports
              </Button>
            </Box>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Attendance Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentData.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Select
                      value={student.delayTime || "Absent"}
                      onChange={(e) => handleAttendanceChange(index, e.target.value)}
                    >
                      <MenuItem value="Absent">Absent</MenuItem>
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledPaper>
      </Box>
    </ThemeProvider>
  );
} 
