import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// Dummy data for demonstration
const initialCourses = [
  {
    id: 1,
    name: 'Introduction to Programming',
    description: 'Learn the basics of programming with Python',
    instructor: 'John Doe',
    status: 'Active',
    enrolledStudents: 45,
    maxStudents: 50,
    startDate: '2024-03-01',
    endDate: '2024-06-30',
  },
  {
    id: 2,
    name: 'Web Development Fundamentals',
    description: 'Master HTML, CSS, and JavaScript',
    instructor: 'Jane Smith',
    status: 'Active',
    enrolledStudents: 38,
    maxStudents: 40,
    startDate: '2024-03-15',
    endDate: '2024-07-15',
  },
];

const instructors = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructor: '',
    status: 'Active',
    maxStudents: 50,
    startDate: '',
    endDate: '',
  });

  const handleOpenDialog = (course?: any) => {
    if (course) {
      setSelectedCourse(course);
      setFormData({
        name: course.name,
        description: course.description,
        instructor: course.instructor,
        status: course.status,
        maxStudents: course.maxStudents,
        startDate: course.startDate,
        endDate: course.endDate,
      });
    } else {
      setSelectedCourse(null);
      setFormData({
        name: '',
        description: '',
        instructor: '',
        status: 'Active',
        maxStudents: 50,
        startDate: '',
        endDate: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
  };

  const handleSubmit = () => {
    if (selectedCourse) {
      // Update existing course
      setCourses(courses.map(course =>
        course.id === selectedCourse.id
          ? { ...course, ...formData }
          : course
      ));
    } else {
      // Add new course
      setCourses([
        ...courses,
        {
          id: courses.length + 1,
          ...formData,
          enrolledStudents: 0,
        },
      ]);
    }
    handleCloseDialog();
  };

  const handleDeleteCourse = (courseId: number) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Course Name', width: 200 },
    { field: 'instructor', headerName: 'Instructor', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'enrolledStudents',
      headerName: 'Enrolled',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={`${params.row.enrolledStudents}/${params.row.maxStudents}`}
          color={params.row.enrolledStudents >= params.row.maxStudents ? 'error' : 'success'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenDialog(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteCourse(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Course Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Course
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Courses</Typography>
              </Box>
              <Typography variant="h4">{courses.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Active Courses</Typography>
              </Box>
              <Typography variant="h4">
                {courses.filter(course => course.status === 'Active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Total Enrollments</Typography>
              </Box>
              <Typography variant="h4">
                {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={courses}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Course Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Instructor</InputLabel>
              <Select
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                label="Instructor"
              >
                {instructors.map((instructor) => (
                  <MenuItem key={instructor} value={instructor}>
                    {instructor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'Active'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.checked ? 'Active' : 'Inactive',
                    })
                  }
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Maximum Students"
              type="number"
              value={formData.maxStudents}
              onChange={(e) =>
                setFormData({ ...formData, maxStudents: parseInt(e.target.value) })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCourse ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseManagement; 