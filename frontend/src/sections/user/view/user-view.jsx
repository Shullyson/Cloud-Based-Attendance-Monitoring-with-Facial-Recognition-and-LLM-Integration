import React, { useState, useEffect } from 'react';

import { Card, Grid, Typography, CardContent, CardActionArea } from '@mui/material';

import Modal from 'src/components/Modal';
import Professors from 'src/components/Professors';
import BulkAddProfessors from 'src/components/BulkAddProfessors';

export default function UserView() {
  const [showProfessorsModal, setShowProfessorsModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);

  const toggleProfessorsModal = () => {
    setShowProfessorsModal((prev) => !prev);
  };

  const toggleBulkAddModal = () => {
    setShowBulkAddModal((prev) => !prev);
  };

  useEffect(() => {
    console.log('showProfessorsModal state changed:', showProfessorsModal);
    console.log('showBulkAddModal state changed:', showBulkAddModal);
  }, [showProfessorsModal, showBulkAddModal]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Professors
      </Typography>

      <Grid container spacing={4}>
        {/* Manage Professors Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={toggleProfessorsModal}>
              <CardContent>
                <Typography variant="h5">Manage Professors</Typography>
                <Typography variant="body2" color="textSecondary">
                  View, edit, or delete professors in the system.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Bulk Add Professors Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardActionArea onClick={toggleBulkAddModal}>
              <CardContent>
                <Typography variant="h5">Bulk Add Professors</Typography>
                <Typography variant="body2" color="textSecondary">
                  Upload a file to add multiple professors at once.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Manage Professors Modal */}
      <Modal show={showProfessorsModal} handleClose={toggleProfessorsModal}>
        <Professors handleClose={toggleProfessorsModal} />
      </Modal>

      {/* Bulk Add Professors Modal */}
      <Modal show={showBulkAddModal} handleClose={toggleBulkAddModal}>
        <BulkAddProfessors handleClose={toggleBulkAddModal} />
      </Modal>
    </div>
  );
}











// // import { useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';

// import 'src/components/style/admin.css';
// import Modal from 'src/components/Modal';
// import Professors from 'src/components/Professors';



// export default function UserView() {
//   const [showProfessorsModal, setShowProfessorsModal] = useState(false);

//   const handleProfessorsModal = () => {
//     console.log("Button Clicked - Toggling Modal");
//     setShowProfessorsModal((prev) => !prev);
//   };

//   useEffect(() => {
//     console.log("showProfessorsModal state changed:", showProfessorsModal);
//   }, [showProfessorsModal]);

//   return (
//     <div>
//       <h1>Manage Professors</h1>
//       <button type="button" onClick={handleProfessorsModal}>Manage Professors</button>
//       <Modal show={showProfessorsModal} handleClose={handleProfessorsModal}>
//         <Professors handleClose={handleProfessorsModal} />
//       </Modal>
//     </div>
//   );
// }
