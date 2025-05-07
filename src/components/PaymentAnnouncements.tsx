import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { financeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

// Define the PaymentAnnouncement type
interface PaymentAnnouncement {
  id: number;
  title: string;
  description: string;
  amount: string;
  payment_details: string;
  due_date: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Define the PaymentSubmission type with student info
interface PaymentSubmission {
  id: number;
  announcement_id: number;
  student_id: number;
  payment_slip_url: string;
  amount_paid: string;
  payment_date: string;
  notes: string | null;
  status: string;
  verification_notes: string | null;
  submitted_at: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  student: {
    id: number;
    enrollment_number: string;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

const PaymentAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<PaymentAnnouncement[]>([]);
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<PaymentAnnouncement | null>(null);
  const [verifyingSubmission, setVerifyingSubmission] = useState<PaymentSubmission | null>(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<number | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    description: '',
    amount: '',
    payment_details: '',
    due_date: new Date().toISOString()
  });
  const [verificationForm, setVerificationForm] = useState({
    status: 'pending',
    verification_notes: ''
  });
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'success' as 'success' | 'error' });
  
  const { isLecturer } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeAPI.getAllAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('Error fetching payment announcements:', err);
      setError('Failed to load payment announcements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (announcementId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeAPI.getSubmissionsForAnnouncement(announcementId);
      setSubmissions(data);
      setSelectedAnnouncementId(announcementId);
      setOpenSubmissionsDialog(true);
    } catch (err) {
      console.error(`Error fetching submissions for announcement ${announcementId}:`, err);
      setMessage({ 
        text: 'Failed to load submissions. Please try again later.', 
        severity: 'error' 
      });
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (announcement: PaymentAnnouncement | null = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setAnnouncementForm({
        title: announcement.title,
        description: announcement.description,
        amount: announcement.amount,
        payment_details: announcement.payment_details,
        due_date: announcement.due_date
      });
    } else {
      setEditingAnnouncement(null);
      setAnnouncementForm({
        title: '',
        description: '',
        amount: '',
        payment_details: '',
        due_date: new Date().toISOString()
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSubmissionsDialog = () => {
    setOpenSubmissionsDialog(false);
    setSubmissions([]);
    setSelectedAnnouncementId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnnouncementForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setAnnouncementForm(prev => ({
        ...prev,
        due_date: date.toISOString()
      }));
    }
  };

  const handleVerificationFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVerificationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingAnnouncement) {
        await financeAPI.updateAnnouncement(editingAnnouncement.id, announcementForm);
        setMessage({ text: 'Payment announcement updated successfully!', severity: 'success' });
      } else {
        await financeAPI.createAnnouncement(announcementForm);
        setMessage({ text: 'Payment announcement created successfully!', severity: 'success' });
      }
      setShowMessage(true);
      handleCloseDialog();
      fetchAnnouncements(); // Refresh the announcements list
    } catch (err) {
      console.error('Error saving payment announcement:', err);
      setMessage({ 
        text: editingAnnouncement ? 'Failed to update announcement' : 'Failed to create announcement', 
        severity: 'error' 
      });
      setShowMessage(true);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: number) => {
    if (!window.confirm('Are you sure you want to delete this payment announcement?')) {
      return;
    }
    
    try {
      await financeAPI.deleteAnnouncement(announcementId);
      setMessage({ text: 'Payment announcement deleted successfully!', severity: 'success' });
      setShowMessage(true);
      fetchAnnouncements(); // Refresh the announcements list
    } catch (err) {
      console.error('Error deleting payment announcement:', err);
      setMessage({ text: 'Failed to delete announcement', severity: 'error' });
      setShowMessage(true);
    }
  };

  const handleOpenVerifyDialog = (submission: PaymentSubmission) => {
    setVerifyingSubmission(submission);
    setVerificationForm({
      status: submission.status,
      verification_notes: submission.verification_notes || ''
    });
    setOpenVerifyDialog(true);
  };

  const handleCloseVerifyDialog = () => {
    setOpenVerifyDialog(false);
    setVerifyingSubmission(null);
  };

  const handleVerifySubmission = async () => {
    if (!verifyingSubmission) return;
    
    try {
      await financeAPI.verifySubmission(verifyingSubmission.id, verificationForm);
      setMessage({ text: 'Payment verification updated successfully!', severity: 'success' });
      setShowMessage(true);
      handleCloseVerifyDialog();
      
      // Refresh the submissions if a dialog is open
      if (selectedAnnouncementId) {
        fetchSubmissions(selectedAnnouncementId);
      }
    } catch (err) {
      console.error('Error verifying payment submission:', err);
      setMessage({ text: 'Failed to update verification status', severity: 'error' });
      setShowMessage(true);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading && announcements.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        pb: 4,
        height: '100%',
        maxHeight: 'calc(100vh - 64px - 24px)',
        overflowY: 'visible',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3} 
        flexWrap="wrap"
        sx={{
          mx: 'auto',
          width: '100%',
          maxWidth: '1100px'
        }}
      >
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            fontWeight: 600, 
            my: 2,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } 
          }}
        >
          Payment Announcements
        </Typography>
        {isLecturer && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            Create Announcement
          </Button>
        )}
      </Box>
      
      {announcements.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: theme.palette.grey[50],
            border: `1px dashed ${theme.palette.grey[300]}`,
            height: '200px',
            mx: 'auto',
            width: '100%',
            maxWidth: '1100px'
          }}
        >
          <PaymentIcon fontSize="large" color="disabled" sx={{ mb: 2 }} />
          <Typography variant="body1" color="textSecondary">
            No payment announcements found.
          </Typography>
          {isLecturer && (
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              onClick={() => handleOpenDialog()}
            >
              Create your first announcement
            </Button>
          )}
        </Paper>
      ) : (
        <Grid 
          container 
          spacing={3}
          sx={{
            mx: 'auto',
            width: '100%',
            maxWidth: '1100px'
          }}
        >
          {announcements.map(announcement => (
            <Grid item xs={12} key={announcement.id}>
              <Card 
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.grey[200]}`,
                  '&:hover': {
                    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                  },
                  transition: 'box-shadow 0.3s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ maxWidth: '800px', mx: 'auto', width: '100%' }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      {announcement.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      paragraph
                      sx={{ 
                        mb: 3,
                        textAlign: 'center'
                      }}
                    >
                      {announcement.description}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 2, justifyContent: 'center' }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            backgroundColor: theme.palette.primary.main + '10',
                            p: 1.5,
                            borderRadius: 2
                          }}
                        >
                          <PaymentIcon color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              Amount
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {announcement.amount}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            backgroundColor: theme.palette.error.main + '10',
                            p: 1.5,
                            borderRadius: 2
                          }}
                        >
                          <EventIcon color="error" sx={{ mr: 1, opacity: 0.7 }} />
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              Due Date
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {formatDate(announcement.due_date)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box mt={3}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          mb: 1.5, 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        Payment Details
                      </Typography>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          backgroundColor: theme.palette.grey[50],
                          maxHeight: '150px',
                          overflow: 'auto'
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {announcement.payment_details}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </CardContent>
                
                {isLecturer && (
                  <CardActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: 'center' }}>
                    <Button 
                      startIcon={<VisibilityIcon />}
                      onClick={() => fetchSubmissions(announcement.id)}
                      variant="contained"
                      color="primary"
                      sx={{ 
                        borderRadius: 2,
                        mr: 1
                      }}
                    >
                      View Submissions
                    </Button>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(announcement)}
                      aria-label="edit announcement"
                      sx={{ 
                        ml: 1,
                        bgcolor: theme.palette.primary.main + '10',
                        '&:hover': {
                          bgcolor: theme.palette.primary.main + '20',
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      aria-label="delete announcement"
                      sx={{ 
                        ml: 1,
                        bgcolor: theme.palette.error.main + '10',
                        '&:hover': {
                          bgcolor: theme.palette.error.main + '20',
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Announcement Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            p: isMobile ? 1 : 0
          }
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" component="div" fontWeight={600}>
            {editingAnnouncement ? 'Edit Payment Announcement' : 'Create Payment Announcement'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="title"
                label="Announcement Title"
                type="text"
                fullWidth
                value={announcementForm.title}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Announcement Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={announcementForm.description}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="amount"
                label="Payment Amount"
                type="text"
                fullWidth
                value={announcementForm.amount}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={new Date(announcementForm.due_date)}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      margin="dense" 
                      fullWidth 
                      sx={{ mb: 2 }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { borderRadius: 2 }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="payment_details"
                label="Payment Details (Bank account, instructions, etc.)"
                type="text"
                fullWidth
                multiline
                rows={3}
                value={announcementForm.payment_details}
                onChange={handleFormChange}
                sx={{ mb: 1 }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit"
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            color="primary"
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            {editingAnnouncement ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Submissions Dialog */}
      <Dialog 
        open={openSubmissionsDialog} 
        onClose={handleCloseSubmissionsDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            height: isMobile ? '100%' : 'auto',
            maxHeight: isMobile ? '100%' : '90vh'
          }
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" component="div" fontWeight={600}>
            Payment Submissions
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2, overflowY: 'auto' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : submissions.length === 0 ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                py: 4
              }}
            >
              <PaymentIcon fontSize="large" color="disabled" sx={{ mb: 2 }} />
              <Typography>No submissions found for this announcement.</Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%', p: 0 }}>
              {submissions.map((submission) => (
                <React.Fragment key={submission.id}>
                  <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                    <Box 
                      sx={{ 
                        px: 3, 
                        py: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        bgcolor: theme.palette.grey[50]
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {submission.student.first_name} {submission.student.last_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Student ID: {submission.student.enrollment_number}
                        </Typography>
                      </Box>
                      <Chip 
                        label={submission.status.toUpperCase()} 
                        color={getStatusColor(submission.status) as 'success' | 'warning' | 'error'} 
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          px: 1
                        }} 
                      />
                    </Box>
                    <Divider />
                    <Box p={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="caption" color="textSecondary">
                            Amount Paid
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {submission.amount_paid}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="caption" color="textSecondary">
                            Payment Date
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {formatDate(submission.payment_date)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="caption" color="textSecondary">
                            Submitted On
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {formatDate(submission.submitted_at)}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {(submission.notes || submission.verification_notes) && (
                        <Box mt={2}>
                          {submission.notes && (
                            <Box mb={2}>
                              <Typography variant="caption" color="textSecondary">
                                Student Notes
                              </Typography>
                              <Typography variant="body2" sx={{ pl: 1, borderLeft: `3px solid ${theme.palette.primary.light}` }}>
                                {submission.notes}
                              </Typography>
                            </Box>
                          )}
                          
                          {submission.verification_notes && (
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                Verification Notes
                              </Typography>
                              <Typography variant="body2" sx={{ pl: 1, borderLeft: `3px solid ${theme.palette.secondary.light}` }}>
                                {submission.verification_notes}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                      
                      <Box mt={3} display="flex" flexWrap="wrap" gap={2}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          href={submission.payment_slip_url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ borderRadius: 2 }}
                        >
                          View Payment Slip
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="primary" 
                          onClick={() => handleOpenVerifyDialog(submission)}
                          sx={{ borderRadius: 2 }}
                        >
                          Update Status
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseSubmissionsDialog} 
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verify Submission Dialog */}
      <Dialog 
        open={openVerifyDialog} 
        onClose={handleCloseVerifyDialog}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            width: { xs: '100%', sm: '500px' },
            maxWidth: '100%'
          }
        }}
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" component="div" fontWeight={600}>
            Update Payment Status
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {verifyingSubmission && (
            <>
              <Box 
                mb={3} 
                p={2} 
                sx={{ 
                  bgcolor: theme.palette.grey[50], 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.grey[200]}`
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {verifyingSubmission.student.first_name} {verifyingSubmission.student.last_name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Student ID: {verifyingSubmission.student.enrollment_number}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Amount Paid: {verifyingSubmission.amount_paid}
                </Typography>
              </Box>
              
              <Box mb={3} display="flex" justifyContent="center">
                <Button 
                  variant="outlined" 
                  size="medium" 
                  href={verifyingSubmission.payment_slip_url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  View Payment Slip
                </Button>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Update Status
                </Typography>
                <TextField
                  select
                  label="Status"
                  name="status"
                  value={verificationForm.status}
                  onChange={handleVerificationFormChange}
                  fullWidth
                  margin="dense"
                  SelectProps={{
                    native: true,
                  }}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </TextField>
              </Box>
              
              <TextField
                margin="dense"
                name="verification_notes"
                label="Verification Notes"
                type="text"
                fullWidth
                multiline
                rows={3}
                value={verificationForm.verification_notes}
                onChange={handleVerificationFormChange}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseVerifyDialog} 
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerifySubmission} 
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar 
        open={showMessage} 
        autoHideDuration={6000} 
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowMessage(false)} 
          severity={message.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentAnnouncements; 