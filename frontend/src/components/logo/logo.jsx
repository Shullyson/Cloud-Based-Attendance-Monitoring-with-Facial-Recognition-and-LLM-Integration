import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import pic from '../../images/upec_logo.png'

// ---------------------------------------u-------------------------------

const Logo = forwardRef(({ sx, ...other }, ref) => (
  <Box
    ref={ref}
    component="img"
    src={pic} 
    alt="UPEC Logo"
    sx={{
      width: 200,
      height: 100,
      display: 'inline-flex',
      ...sx,
    }}
    {...other}
  />
));

Logo.propTypes = {
  sx: PropTypes.object,
};

export default Logo;
