import React from 'react';
import { Box, Typography } from '@mui/material';
import PaymentAnnouncements from '../../components/PaymentAnnouncements';

const FinanceManagement: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Finance Management
      </Typography>
      <Box mt={3}>
        <PaymentAnnouncements />
      </Box>
    </Box>
  );
};

export default FinanceManagement; 