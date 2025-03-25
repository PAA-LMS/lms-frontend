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
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Define the Course type
interface Course {
  id: number;
  title: string;
  description: string | null;
  lecturer_id: number;
  created_at: string;
  updated_at: string;
}

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: ''
  });
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'success' as 'success' | 'error' });
  
  const { isLecturer } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the courses - if lecturer, fetch only their courses
      const data = isLecturer 
        ? await coursesAPI.getLecturerCourses() 
        : await coursesAPI.getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course: Course | null = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        description: course.description || ''
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        title: '',
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingCourse) {
        await coursesAPI.updateCourse(editingCourse.id, courseForm);
        setMessage({ text: 'Course updated successfully!', severity: 'success' });
      } else {
        await coursesAPI.createCourse(courseForm);
        setMessage({ text: 'Course created successfully!', severity: 'success' });
      }
      setShowMessage(true);
      handleCloseDialog();
      fetchCourses(); // Refresh the courses list
    } catch (err) {
      console.error('Error saving course:', err);
      setMessage({ 
        text: editingCourse ? 'Failed to update course' : 'Failed to create course', 
        severity: 'error' 
      });
      setShowMessage(true);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    
    try {
      await coursesAPI.deleteCourse(courseId);
      setMessage({ text: 'Course deleted successfully!', severity: 'success' });
      setShowMessage(true);
      fetchCourses(); // Refresh the courses list
    } catch (err) {
      console.error('Error deleting course:', err);
      setMessage({ text: 'Failed to delete course', severity: 'error' });
      setShowMessage(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          {isLecturer ? 'My Courses' : 'Available Courses'}
        </Typography>
        {isLecturer && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Course
          </Button>
        )}
      </Box>
      
      {courses.length === 0 ? (
        <Typography variant="body1">No courses found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {courses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {course.description || 'No description available'}
                  </Typography>
                </CardContent>
                {isLecturer && (
                  <CardActions>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(course)}
                      aria-label="edit course"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteCourse(course.id)}
                      aria-label="delete course"
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

      {/* Add/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Course Title"
            type="text"
            fullWidth
            value={courseForm.title}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Course Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={courseForm.description}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingCourse ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar 
        open={showMessage} 
        autoHideDuration={6000} 
        onClose={() => setShowMessage(false)}
      >
        <Alert 
          onClose={() => setShowMessage(false)} 
          severity={message.severity}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CoursesList; 