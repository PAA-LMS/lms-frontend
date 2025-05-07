import React from 'react';
import { Box, Typography } from '@mui/material';
import StudentPayments from '../../components/StudentPayments';

const Payments: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Payments
      </Typography>
      <Box mt={3}>
        <StudentPayments />
      </Box>
    </Box>
  );
};

export default Payments; 