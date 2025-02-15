import React, { useState, useEffect } from 'react';

import { Card, Grid, Typography, CardContent, CardActionArea } from '@mui/material';

import Modal from 'src/components/Modal';
import ManageCourses from 'src/components/ManageCourses';
import BulkAddCourses from 'src/components/BulkAddCourses';

export default function CourseView() {
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);

  const toggleCoursesModal = () => {
    setShowCoursesModal((prev) => !prev);
  };

  const toggleBulkAddModal = () => {
    setShowBulkAddModal((prev) => !prev);
  };

  useEffect(() => {
    console.log('showCoursesModal state changed:', showCoursesModal);
    console.log('showBulkAddModal state changed:', showBulkAddModal);
  }, [showCoursesModal, showBulkAddModal]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Courses
      </Typography>

      <Grid container spacing={4}>
        {/* Manage Courses Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={toggleCoursesModal}>
              <CardContent>
                <Typography variant="h5">Manage Courses</Typography>
                <Typography variant="body2" color="textSecondary">
                  View, edit, or delete courses in the system.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Bulk Add Courses Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={toggleBulkAddModal}>
              <CardContent>
                <Typography variant="h5">Bulk Add Courses</Typography>
                <Typography variant="body2" color="textSecondary">
                  Upload a file to add multiple courses at once.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Manage Courses Modal */}
      <Modal show={showCoursesModal} handleClose={toggleCoursesModal}>
        <ManageCourses handleClose={toggleCoursesModal} />
      </Modal>

      {/* Bulk Add Courses Modal */}
      <Modal show={showBulkAddModal} handleClose={toggleBulkAddModal}>
        <BulkAddCourses handleClose={toggleBulkAddModal} />
      </Modal>
    </div>
  );
}
