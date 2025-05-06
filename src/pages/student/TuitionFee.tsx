import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';

// Dummy data for demonstration
const tuitionDetails = {
  currentBalance: 2500.00,
  dueDate: '2024-04-15',
  status: 'Pending',
  semester: 'Spring 2024',
  paymentHistory: [
    {
      id: 1,
      date: '2024-01-15',
      amount: 2500.00,
      description: 'Spring 2024 Tuition',
      status: 'Paid',
    },
    {
      id: 2,
      date: '2023-09-15',
      amount: 2500.00,
      description: 'Fall 2023 Tuition',
      status: 'Paid',
    },
  ],
};

const TuitionFee: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Tuition Fee
      </Typography>

      <Grid container spacing={3}>
        {/* Current Balance Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Current Balance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    ${tuitionDetails.currentBalance.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Due Date: {tuitionDetails.dueDate}
                </Typography>
                <Chip
                  label={tuitionDetails.status}
                  color={getStatusColor(tuitionDetails.status)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                Payment History
              </Typography>
              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                color="primary"
              >
                Make Payment
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tuitionDetails.paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell align="right">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={payment.status}
                          color={getStatusColor(payment.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TuitionFee; 