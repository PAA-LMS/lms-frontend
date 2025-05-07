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
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

// Define the Course type
interface Course {
  id: number;
  title: string;
  description: string | null;
  lecturer_id: number;
  created_at: string;
  updated_at: string;
}

// Define Week type
interface Week {
  id: number;
  title: string;
  description: string;
  week_number: number;
  course_id: number;
  materials?: Material[];
}

// Define Material type
interface Material {
  id: number;
  title: string;
  description: string;
  material_type: string;
  content: string;
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
  const navigate = useNavigate();

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

  const handleManageMaterials = (courseId: number) => {
    navigate(`/teacher/course/${courseId}/materials`);
  };

  // Function to generate PDF report
  const generateReport = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Course Management Report', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
      
      // Add courses information
      let yPos = 30;
      
      for (const course of courses) {
        // Don't exceed page limits
        if (yPos > 270) {
          doc.addPage();
          yPos = 15;
        }
        
        doc.setFontSize(16);
        doc.text(`Course: ${course.title}`, 14, yPos);
        yPos += 7;
        
        doc.setFontSize(12);
        doc.text(`Description: ${course.description || 'No description'}`, 14, yPos);
        yPos += 7;
        
        doc.text(`Created: ${new Date(course.created_at).toLocaleDateString()}`, 14, yPos);
        yPos += 7;
        
        // Get course stats or details
        try {
          const weeks = await coursesAPI.getCourseWeeks(course.id);
          
          doc.text(`Number of Weeks: ${weeks.length}`, 14, yPos);
          yPos += 7;
          
          // Count materials across all weeks
          let totalMaterials = 0;
          for (const week of weeks) {
            try {
              const materials = await coursesAPI.getMaterialsForWeek(week.id);
              totalMaterials += materials.length;
            } catch (error) {
              console.error(`Error fetching materials for week ${week.id}:`, error);
            }
          }
          
          doc.text(`Total Materials: ${totalMaterials}`, 14, yPos);
          yPos += 15; // Add extra spacing between courses
        } catch (error) {
          console.error(`Error fetching weeks for course ${course.id}:`, error);
          doc.text(`Weeks information not available`, 14, yPos);
          yPos += 15;
        }
      }
      
      // Save the PDF
      const filename = `course_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      setMessage({ text: 'Report generated successfully!', severity: 'success' });
      setShowMessage(true);
    } catch (error) {
      console.error('Error generating report:', error);
      setMessage({ text: 'Failed to generate report', severity: 'error' });
      setShowMessage(true);
    } finally {
      setLoading(false);
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
          <Box>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<PictureAsPdfIcon />}
              onClick={generateReport}
              sx={{ mr: 2 }}
            >
              Generate Report
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Course
            </Button>
          </Box>
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
                    <Tooltip title="Manage Course Materials">
                      <IconButton 
                        color="secondary" 
                        onClick={() => handleManageMaterials(course.id)}
                        aria-label="manage course materials"
                      >
                        <ArticleIcon />
                      </IconButton>
                    </Tooltip>
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