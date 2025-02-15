import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import {
  Box,
  Alert,
  Radio,
  Button,
  TextField,
  FormLabel,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import ChatBot from 'src/rasa/chat';

import "src/components/style/admin.css";

import logo from '../images/UPEC LOGO.jpg';
import backgroundImage from '../images/app.jpg';

// Styled Components
const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
}));

const Main = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1 0 auto',
  flexDirection: { xs: 'column', md: 'row' },
  width: '90%',
  maxWidth: '1000px',
  margin: 'auto',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
}));

const Left = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  flex: 1,
  borderRight: '1px solid #e0e0e0',
}));

const Right = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  color: theme.palette.common.white,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(10),
  flex: 1,
  minHeight: '300px',
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  textAlign: 'left',
  width: '100%',
  position: 'relative',
  bottom: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
}));

const Logo = styled('img')(({ theme }) => ({
  width: '120px',
  marginBottom: theme.spacing(2),
}));

// Main Login Component
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Chat state

  const navigate = useNavigate();

  // Toggle Chat Functionality
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle Login Submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password,
        role,
      });

      if (response.status === 200 && response.data.success) {
        console.log('Login successful:', response.data.message);
        console.log('Redirecting role:', role);

        // Role-based navigation
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'professor') {
          localStorage.setItem('loggedInProfessor', username);
          navigate('/professor');
        } else if (role === 'student') {
          localStorage.setItem('loggedInStudent', username);
          navigate('/student');
        } else {
          setError('Unknown role. Please try again.');
        }
      } else {
        console.error('Login failed:', response.data.message);
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err.response || err.message);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      <Main>
        <Left>
          <Logo src={logo} alt="UPEC Logo" />
          <Typography color="#9e1b32" component="h1" variant="h5" fontFamily="monospace">
            UPEC Attendance System
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel>Role</FormLabel>
              <RadioGroup
                row
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                <FormControlLabel value="professor" control={<Radio />} label="Professor" />
                <FormControlLabel value="student" control={<Radio />} label="Student" />
              </RadioGroup>
            </FormControl>
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
        </Left>
        <Right />
      </Main>
      <Footer>
        <Typography variant="body2">
          © 2024 UPEC. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Contact us: info@upec.edu
        </Typography>
      </Footer>

      {/* Chat Button and Component */}
      <Box sx={{ position: 'fixed', bottom: 70, right: 35 }}>
        <Button
          variant="contained"
          onClick={toggleChat}
          sx={{ backgroundColor: '#9e1b32', color: '#fff', borderRadius: '50%', width: 66, height: 66 }}
        >
          💬
        </Button>
        {isOpen && <ChatBot />}
      </Box>
    </Root>
  );
}

export default Login;