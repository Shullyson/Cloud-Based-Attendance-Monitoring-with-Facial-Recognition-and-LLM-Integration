import "jspdf-autotable";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Card,
  Grid,
  Table,
  AppBar,
  Button,
  Avatar,
  Select,
  Toolbar,
  MenuItem,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  InputLabel,
  FormControl,
  CardContent,
} from "@mui/material";

import ChatBot from "src/rasa/studentchat";

import "src/components/style/admin.css";
import UPEClogo from "src/components/logo/upec3.png";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
  },
});

const StudentPage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Chat state
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    number: "",
    image: "",
  });
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [studentData, setStudentData] = useState([]);
  const [statistics, setStatistics] = useState({
    sessions: 0,
    present: 0,
    absent: 0,
    late: 0,
    totalScore: 0,
  });

  // Toggle Chat Functionality
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const loggedInStudent = localStorage.getItem("loggedInStudent");
    if (loggedInStudent) {
      fetchStudentDetails(loggedInStudent);
      fetchCourses();
      fetchAcademicYears();
    }
  }, []);

  const fetchLogs = useCallback(() => {
    let url = `http://127.0.0.1:5000/logs/${selectedAcademicYear}`;
    const params = selectedCourse !== "all" ? [`course=${selectedCourse}`] : [];
    if (params.length) url += `?${params.join("&")}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setStudentData(data.logs);
        calculateStatistics(data.logs);
      })
      .catch(() => alert("An error occurred while fetching logs."));
  }, [selectedAcademicYear, selectedCourse]);

  useEffect(() => {
    if (selectedAcademicYear) {
      fetchLogs();
    }
  }, [selectedAcademicYear, selectedCourse, fetchLogs]);

  const fetchStudentDetails = (studentName) => {
    fetch(`http://127.0.0.1:5000/student/${studentName}`)
      .then((response) => response.json())
      .then((data) => {
        setStudentDetails({
          name: data.name,
          number: data.studentNumber,
          image: `http://127.0.0.1:5000/faces/${data.imageFilename}`,
        });
      })
      .catch(() => alert("An error occurred while fetching student details."));
  };

  const fetchCourses = () => {
    fetch("http://127.0.0.1:5000/course")
      .then((response) => response.json())
      .then((data) => setCourses(data.courses))
      .catch(() => alert("An error occurred while fetching courses."));
  };

  const fetchAcademicYears = () => {
    fetch("http://127.0.0.1:5000/academic_years")
      .then((response) => response.json())
      .then((data) => setAcademicYears(data.academicYears))
      .catch(() => alert("An error occurred while fetching academic years."));
  };

  const calculateStatistics = (data) => {
    const sessions = data.length;
    const present = data.filter((entry) => entry.status === "Present").length;
    const absent = data.filter((entry) => entry.status === "Absent").length;
    const late = data.filter((entry) => entry.status === "Late").length;
    const totalScore = data.reduce((acc, entry) => acc + entry.score, 0);

    setStatistics({
      sessions,
      present,
      absent,
      late,
      totalScore,
    });
  };

  const downloadPDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF(); // Correctly instantiates jsPDF
  
    doc.setFontSize(12);
    doc.text(`Student: ${studentDetails.name}`, 10, 10);
    doc.text(`Student Number: ${studentDetails.number}`, 10, 20);
    doc.text(`Academic Year: ${selectedAcademicYear}`, 10, 30);
    doc.text(`Selected Course: ${selectedCourse}`, 10, 40);
  
    doc.autoTable({
      startY: 50,
      head: [["Date", "Status", "Score"]],
      body: studentData.map((entry) => [entry.class_date, entry.status, entry.score]),
    });
  
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 10,
      head: [["Number of Sessions", "Present", "Late", "Absent", "Total Score"]],
      body: [[statistics.sessions, statistics.present, statistics.late, statistics.absent, statistics.totalScore]],
    });
  
    doc.save("report.pdf");
  };
  

  const handleLogout = () => {
    localStorage.removeItem("loggedInStudent");
    navigate("/");
  };

  const handleCheckSchedule = () => {
    const scheduleUrl =
      "https://www.international-master-biometrics-intelligent-vision.org/schedule-master-1";
    const password = "2024";
    window.open(`${scheduleUrl}?password=${password}`, "_blank");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <img
              src={UPEClogo}
              alt="UPEC Logo"
              style={{ height: 60, width: 150, marginRight: 25, marginLeft: 0 }}
            />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Student Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>

        <Box m={3}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    src={studentDetails.image}
                    alt={studentDetails.name}
                    sx={{ width: 100, height: 100 }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6">{studentDetails.name}</Typography>
                  <Typography>Student Number: {studentDetails.number}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box my={3}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Academic Year</InputLabel>
                  <Select
                    value={selectedAcademicYear}
                    onChange={(e) => setSelectedAcademicYear(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select Academic Year</em>
                    </MenuItem>
                    {academicYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <MenuItem value="all">
                      <em>All Courses</em>
                    </MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course} value={course}>
                        {course}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.class_date}</TableCell>
                  <TableCell>{entry.status}</TableCell>
                  <TableCell>{entry.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box mt={3}>
            <Button variant="contained" color="primary" onClick={downloadPDF}>
              Download Report
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCheckSchedule}
              sx={{ ml: 2 }}
            >
              Check Schedule
            </Button>
          </Box>
        </Box>

        {/* Chat Button and Component */}
        <Box sx={{ position: "fixed", bottom: 70, right: 35 }}>
          <Button
            variant="contained"
            onClick={toggleChat}
            sx={{
              backgroundColor: "#9e1b32",
              color: "#fff",
              borderRadius: "50%",
              width: 66,
              height: 66,
            }}
          >
            💬
          </Button>
          {isOpen && <ChatBot />}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default StudentPage;
