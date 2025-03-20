import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Book as BookIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
} from '@mui/icons-material';

// Dummy data for demonstration
const courses = [
  {
    id: 1,
    name: 'Mathematics 101',
    code: 'MATH101',
    students: 45,
    assignments: 8,
    status: 'active',
    description: 'Introduction to basic mathematical concepts and problem-solving techniques.',
    instructor: 'Dr. John Smith',
    schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
  },
  {
    id: 2,
    name: 'Physics Lab',
    code: 'PHYS101',
    students: 32,
    assignments: 5,
    status: 'active',
    description: 'Hands-on laboratory experiments in classical physics.',
    instructor: 'Dr. Sarah Johnson',
    schedule: 'Tue, Thu 2:00 PM - 4:00 PM',
  },
  {
    id: 3,
    name: 'Chemistry 101',
    code: 'CHEM101',
    students: 38,
    assignments: 6,
    status: 'active',
    description: 'Fundamental principles of chemistry and laboratory techniques.',
    instructor: 'Dr. Michael Brown',
    schedule: 'Mon, Wed 2:00 PM - 3:30 PM',
  },
  {
    id: 4,
    name: 'Biology 101',
    code: 'BIO101',
    students: 42,
    assignments: 7,
    status: 'upcoming',
    description: 'Introduction to biological concepts and cellular processes.',
    instructor: 'Dr. Emily Davis',
    schedule: 'Tue, Thu 10:00 AM - 11:30 AM',
  },
];

const TeacherCourseManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    schedule: '',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      schedule: '',
    });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, course: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourse(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'upcoming':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Course Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Create New Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} key={course.id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.code}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, course)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {course.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip
                  icon={<PeopleIcon />}
                  label={`${course.students} students`}
                  size="small"
                />
                <Chip
                  icon={<AssignmentIcon />}
                  label={`${course.assignments} assignments`}
                  size="small"
                />
                <Chip
                  icon={<EventIcon />}
                  label={course.schedule}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                  label={course.status}
                  color={getStatusColor(course.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
                <Typography variant="body2" color="text.secondary">
                  Instructor: {course.instructor}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Course Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} /> Edit Course
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <BookIcon sx={{ mr: 1 }} /> Manage Content
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete Course
        </MenuItem>
      </Menu>

      {/* Create/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Course Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Course Code"
              name="code"
              value={formData.code}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleFormChange}
              placeholder="e.g., Mon, Wed 10:00 AM - 11:30 AM"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCloseDialog} variant="contained">
            Create Course
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherCourseManagement; 