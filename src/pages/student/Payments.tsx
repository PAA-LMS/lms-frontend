import React from 'react';
import { Box } from '@mui/material';
import StudentPayments from '../../components/StudentPayments';
import { useTheme } from '@mui/material/styles';

const Payments: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        height: 'calc(100vh - 64px)',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box 
        sx={{ 
          height: '100%',
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: 4,
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '10px',
            position: 'absolute',
            right: 0
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[300],
            borderRadius: '4px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.grey[400],
            border: '2px solid transparent',
            backgroundClip: 'padding-box'
          },
        }}
      >
        <StudentPayments />
      </Box>
    </Box>
  );
};

export default Payments; 