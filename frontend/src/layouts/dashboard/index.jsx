import { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Button } from '@mui/material'; // Fixed Button import
import ChatBot from 'src/rasa/adminchat';

import "src/components/style/admin.css";

import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Chat state

  // Toggle Chat Functionality
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>

      {/* Chat Button and Component */}
      <Box sx={{ position: 'fixed', bottom: 70, right: 35 }}> {/* Adjusted position */}
        <Button
          variant="contained"
          onClick={toggleChat}
          sx={{
            backgroundColor: '#9e1b32',
            color: '#fff',
            borderRadius: '50%',
            width: 66,
            height: 66,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
          }}
        >
          💬
        </Button>
        {isOpen && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 150, 
              right: 35,
              width: '300px', 
              maxHeight: '600px', 
              overflow: 'auto', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
              zIndex: 1000, 
            }}
          >
            <ChatBot />
          </Box>
        )}
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
