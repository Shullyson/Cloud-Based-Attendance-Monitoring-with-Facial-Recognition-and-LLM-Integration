import React, { useState, useEffect } from 'react';

import { Card, Grid, Typography, CardContent, CardActionArea } from '@mui/material';

import Modal from 'src/components/Modal';
import ManageProgram from 'src/components/ManageProgram';
import BulkAddProgram from 'src/components/BulkAddProgram';

export default function ProgramView() {
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);

  const toggleProgramModal = () => {
    setShowProgramModal((prev) => !prev);
  };

  const toggleBulkAddModal = () => {
    setShowBulkAddModal((prev) => !prev);
  };

  useEffect(() => {
    console.log('showProgramModal state changed:', showProgramModal);
    console.log('showBulkAddModal state changed:', showBulkAddModal);
  }, [showProgramModal, showBulkAddModal]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Programs
      </Typography>

      <Grid container spacing={4}>
        {/* Manage Programs Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={toggleProgramModal}>
              <CardContent>
                <Typography variant="h5">Manage Programs</Typography>
                <Typography variant="body2" color="textSecondary">
                  View, edit, or delete programs in the system.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Bulk Add Programs Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={toggleBulkAddModal}>
              <CardContent>
                <Typography variant="h5">Bulk Add Programs</Typography>
                <Typography variant="body2" color="textSecondary">
                  Upload a file to add multiple programs at once.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Manage Programs Modal */}
      <Modal show={showProgramModal} handleClose={toggleProgramModal}>
        <ManageProgram handleClose={toggleProgramModal} />
      </Modal>

      {/* Bulk Add Programs Modal */}
      <Modal show={showBulkAddModal} handleClose={toggleBulkAddModal}>
        <BulkAddProgram handleClose={toggleBulkAddModal} />
      </Modal>
    </div>
  );
}
