import React, { useState, useEffect } from 'react';

import { Card, Grid, Typography, CardContent, CardActionArea } from '@mui/material';

import Modal from 'src/components/Modal';
import ManageStudents from 'src/components/ManageStudents';
import BulkAddStudents from 'src/components/BulkAddStudents';

export default function StudentView() {
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);

  const toggleStudentsModal = () => {
    setShowStudentsModal((prev) => !prev);
  };

  const toggleBulkAddModal = () => {
    setShowBulkAddModal((prev) => !prev);
  };

  useEffect(() => {
    console.log('showStudentsModal state changed:', showStudentsModal);
    console.log('showBulkAddModal state changed:', showBulkAddModal);
  }, [showStudentsModal, showBulkAddModal]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Students
      </Typography>

      <Grid container spacing={4}>
        {/* Manage Students Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={toggleStudentsModal}>
              <CardContent>
                <Typography variant="h5">Manage Students</Typography>
                <Typography variant="body2" color="textSecondary">
                  View, edit, or delete students in the system.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Bulk Add Students Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={toggleBulkAddModal}>
              <CardContent>
                <Typography variant="h5">Bulk Add Students</Typography>
                <Typography variant="body2" color="textSecondary">
                  Upload a file to add multiple students at once.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Manage Students Modal */}
      <Modal show={showStudentsModal} handleClose={toggleStudentsModal}>
        <ManageStudents handleClose={toggleStudentsModal} />
      </Modal>

      {/* Bulk Add Students Modal */}
      <Modal show={showBulkAddModal} handleClose={toggleBulkAddModal}>
        <BulkAddStudents handleClose={toggleBulkAddModal} />
      </Modal>
    </div>
  );
}
