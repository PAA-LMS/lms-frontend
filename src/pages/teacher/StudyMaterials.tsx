import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Snackbar,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Class as ClassIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  InsertDriveFile as DriveIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { coursesAPI } from '../../services/api';
import TeacherLayout from '../../components/layout/TeacherLayout';

interface Course {
  id: number;
  title: string;
  description: string | null;
  lecturer_id: number;
  created_at: string;
  updated_at: string;
}

interface CourseWeek {
  id: number;
  course_id: number;
  title: string;
  description: string;
  week_number: number;
  created_at?: string;
  updated_at?: string;
}

interface CourseMaterial {
  id: number;
  week_id: number;
  title: string;
  description: string;
  material_type: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

interface StudentSubmission {
  id: number;
  assignment_id: number;
  student_id: number;
  submission_url: string;
  submitted_at: string;
  updated_at: string;
  status: string;
  grade: string | null;
  feedback: string | null;
  student?: {
    id: number;
    user_id: number;
    enrollment_number: string;
    user?: {
      first_name: string;
      last_name: string;
      email: string;
    }
  };
}

const StudyMaterials: React.FC = () => {
  const { isLecturer } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseWeeks, setCourseWeeks] = useState<CourseWeek[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<CourseWeek | null>(null);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [weekDialogOpen, setWeekDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  
  // Form states
  const [weekForm, setWeekForm] = useState({
    title: '',
    description: '',
    week_number: 1,
  });
  
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    material_type: 'drive_url',
    content: '',
  });
  
  // Filter states
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string>('all');
  
  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  // Submissions states
  const [submissionsDialogOpen, setSubmissionsDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<CourseMaterial | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);

  // Grading states
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [feedbackValue, setFeedbackValue] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseWeeks(selectedCourse.id);
    } else {
      setCourseWeeks([]);
      setSelectedWeek(null);
      setMaterials([]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedWeek) {
      fetchCourseMaterials(selectedWeek.id);
    } else {
      setMaterials([]);
    }
  }, [selectedWeek]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await coursesAPI.getLecturerCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseWeeks = async (courseId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/course-weeks/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Sort weeks by week_number
      const sortedWeeks = response.data.sort(
        (a: CourseWeek, b: CourseWeek) => a.week_number - b.week_number
      );
      
      setCourseWeeks(sortedWeeks);
      setSelectedWeek(null);
      setError(null);
    } catch (err) {
      console.error('Error fetching course weeks:', err);
      setError('Failed to load course weeks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseMaterials = async (weekId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/course-materials/week/${weekId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching course materials:', err);
      setError('Failed to load course materials. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  const handleWeekClick = (week: CourseWeek) => {
    setSelectedWeek(week);
  };

  const handleBackToWeeks = () => {
    setSelectedWeek(null);
  };

  // Week Dialog Handlers
  const handleOpenAddWeekDialog = () => {
    setDialogMode('add');
    
    // Set the next week number automatically
    const nextWeekNumber = courseWeeks.length > 0 
      ? Math.max(...courseWeeks.map(week => week.week_number)) + 1 
      : 1;
    
    setWeekForm({
      title: `Week ${nextWeekNumber}`,
      description: '',
      week_number: nextWeekNumber,
    });
    
    setWeekDialogOpen(true);
  };

  const handleOpenEditWeekDialog = (week: CourseWeek) => {
    setDialogMode('edit');
    setWeekForm({
      title: week.title,
      description: week.description,
      week_number: week.week_number,
    });
    setSelectedWeek(week);
    setWeekDialogOpen(true);
  };

  const handleCloseWeekDialog = () => {
    setWeekDialogOpen(false);
  };

  const handleWeekFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWeekForm({
      ...weekForm,
      [name]: name === 'week_number' ? parseInt(value) || 1 : value,
    });
  };

  const handleSubmitWeek = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (dialogMode === 'add' && selectedCourse) {
        // Create new week
        await axios.post(
          'http://localhost:8000/course-weeks/',
          {
            ...weekForm,
            course_id: selectedCourse.id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setAlertMessage('Course week added successfully!');
        setAlertSeverity('success');
      } else if (dialogMode === 'edit' && selectedWeek) {
        // Update existing week
        await axios.put(
          `http://localhost:8000/course-weeks/${selectedWeek.id}`,
          weekForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setAlertMessage('Course week updated successfully!');
        setAlertSeverity('success');
      }
      
      setAlertOpen(true);
      handleCloseWeekDialog();
      
      if (selectedCourse) {
        fetchCourseWeeks(selectedCourse.id);
      }
    } catch (err) {
      console.error('Error saving course week:', err);
      setAlertMessage('Failed to save course week. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleDeleteWeek = async (weekId: number) => {
    if (!window.confirm('Are you sure you want to delete this week? This will delete all materials associated with this week.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/course-weeks/${weekId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAlertMessage('Course week deleted successfully!');
      setAlertSeverity('success');
      setAlertOpen(true);
      
      if (selectedCourse) {
        fetchCourseWeeks(selectedCourse.id);
      }
    } catch (err) {
      console.error('Error deleting course week:', err);
      setAlertMessage('Failed to delete course week. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  // Material Dialog Handlers
  const handleOpenAddMaterialDialog = () => {
    setDialogMode('add');
    setMaterialForm({
      title: '',
      description: '',
      material_type: 'drive_url',
      content: '',
    });
    setMaterialDialogOpen(true);
  };

  const handleOpenEditMaterialDialog = (material: CourseMaterial) => {
    setDialogMode('edit');
    setMaterialForm({
      title: material.title,
      description: material.description,
      material_type: material.material_type,
      content: material.content,
    });
    setMaterialDialogOpen(true);
  };

  const handleCloseMaterialDialog = () => {
    setMaterialDialogOpen(false);
  };

  const handleMaterialFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setMaterialForm({
      ...materialForm,
      [name]: value,
    });
  };

  const handleSubmitMaterial = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (dialogMode === 'add' && selectedWeek) {
        // Create new material
        await axios.post(
          'http://localhost:8000/course-materials/',
          {
            ...materialForm,
            week_id: selectedWeek.id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setAlertMessage('Course material added successfully!');
        setAlertSeverity('success');
      } else if (dialogMode === 'edit' && selectedWeek) {
        // Find the material to edit
        const materialToEdit = materials.find(m => 
          m.title === materialForm.title && m.week_id === selectedWeek.id
        );
        
        if (materialToEdit) {
          await axios.put(
            `http://localhost:8000/course-materials/${materialToEdit.id}`,
            materialForm,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          
          setAlertMessage('Course material updated successfully!');
          setAlertSeverity('success');
        }
      }
      
      setAlertOpen(true);
      handleCloseMaterialDialog();
      
      if (selectedWeek) {
        fetchCourseMaterials(selectedWeek.id);
      }
    } catch (err) {
      console.error('Error saving course material:', err);
      setAlertMessage('Failed to save course material. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/course-materials/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAlertMessage('Course material deleted successfully!');
      setAlertSeverity('success');
      setAlertOpen(true);
      
      if (selectedWeek) {
        fetchCourseMaterials(selectedWeek.id);
      }
    } catch (err) {
      console.error('Error deleting course material:', err);
      setAlertMessage('Failed to delete course material. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Helper function to get material type icon
  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'link':
        return <LinkIcon color="primary" sx={{ mr: 1 }} />;
      case 'drive_url':
      case 'gdrive':
        return <DriveIcon color="primary" sx={{ mr: 1 }} />;
      case 'assignment':
        return <FolderIcon color="primary" sx={{ mr: 1 }} />;  // Use appropriate assignment icon
      default:
        return <DriveIcon color="primary" sx={{ mr: 1 }} />;
    }
  };

  // Helper function to get material type label
  const getMaterialTypeLabel = (type: string) => {
    switch (type) {
      case 'link':
        return 'Web Link';
      case 'drive_url':
      case 'gdrive':
        return 'Google Drive';
      case 'assignment':
        return 'Assignment';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Submissions handlers
  const handleViewSubmissions = async (assignment: CourseMaterial) => {
    if (assignment.material_type !== 'assignment') return;
    
    setSelectedAssignment(assignment);
    setLoadingSubmissions(true);
    setSubmissionsError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/assignments/material/${assignment.id}/submissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubmissions(response.data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setSubmissionsError('Failed to load submissions. Please try again.');
    } finally {
      setLoadingSubmissions(false);
    }
    
    setSubmissionsDialogOpen(true);
  };

  const handleCloseSubmissionsDialog = () => {
    setSubmissionsDialogOpen(false);
    setSelectedAssignment(null);
    setSubmissions([]);
  };

  const handleOpenGradingDialog = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setGradeValue(submission.grade || '');
    setFeedbackValue(submission.feedback || '');
    setGradingDialogOpen(true);
  };

  const handleCloseGradingDialog = () => {
    setGradingDialogOpen(false);
    setSelectedSubmission(null);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGradeValue(e.target.value);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackValue(e.target.value);
  };

  const handleSubmitGrade = async () => {
    if (!selectedSubmission) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/assignments/submissions/${selectedSubmission.id}`,
        {
          grade: gradeValue,
          feedback: feedbackValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update submission in the list
      setSubmissions(submissions.map(sub => 
        sub.id === selectedSubmission.id 
          ? { ...sub, grade: gradeValue, feedback: feedbackValue, status: 'graded' } 
          : sub
      ));
      
      // Close the dialog
      handleCloseGradingDialog();
      
      // Show success message
      setAlertMessage('Submission graded successfully!');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (err) {
      console.error('Error grading submission:', err);
      setAlertMessage('Failed to grade submission. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  // Render functions
  const renderCoursesList = () => {
    if (loading && courses.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error && courses.length === 0) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }

    if (courses.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No courses found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have any courses yet. Create a course in the Course Management section.
          </Typography>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
                cursor: 'pointer'
              }}
              onClick={() => handleCourseClick(course)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ClassIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    {course.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {course.description || 'No description available'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderWeeksList = () => {
    if (!selectedCourse) return null;

    if (loading && courseWeeks.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

  return (
    <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            onClick={handleBackToCourses}
            sx={{ mr: 2 }}
          >
            Back to Courses
          </Button>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            {selectedCourse.title} - Weeks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddWeekDialog}
          >
            Add Week
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {courseWeeks.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No weeks found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add weeks to organize your course materials.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {courseWeeks.map((week) => (
              <Grid item xs={12} sm={6} md={4} key={week.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {week.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {week.description || 'No description available'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => handleWeekClick(week)}
                      sx={{ mr: 1 }}
                    >
                      View Materials
                    </Button>
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleOpenEditWeekDialog(week)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteWeek(week.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

  const renderMaterialsList = () => {
    if (!selectedCourse || !selectedWeek) return null;

    if (loading && materials.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    // Add filter for material types
    const filteredMaterials = materialTypeFilter === 'all' 
      ? materials 
      : materials.filter(material => material.material_type === materialTypeFilter);

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            variant="outlined" 
            onClick={handleBackToWeeks}
            sx={{ mr: 2 }}
          >
            Back to Weeks
          </Button>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            {selectedCourse.title} - {selectedWeek.title}
          </Typography>
          
          {/* Add filter dropdown */}
          <FormControl size="small" sx={{ width: 150, mr: 2 }}>
            <InputLabel>Material Type</InputLabel>
            <Select
              value={materialTypeFilter}
              label="Material Type"
              onChange={(e) => setMaterialTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="drive_url">Google Drive</MenuItem>
              <MenuItem value="link">Web Link</MenuItem>
              <MenuItem value="assignment">Assignment</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddMaterialDialog}
          >
            Add Material
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {filteredMaterials.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No materials found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {materialTypeFilter === 'all' 
                ? 'Add materials such as Google Drive links for this week.'
                : `No ${getMaterialTypeLabel(materialTypeFilter).toLowerCase()} materials found in this week.`}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredMaterials.map((material) => (
              <Grid item xs={12} key={material.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getMaterialTypeIcon(material.material_type)}
                      <Typography variant="h6">{material.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {material.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Type: {getMaterialTypeLabel(material.material_type)}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      href={material.content}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {material.material_type === 'assignment' ? 'View Assignment' : 'Open Material'}
                    </Button>
                    
                    {/* If this is an assignment, add button to view submissions */}
                    {isLecturer && material.material_type === 'assignment' && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        sx={{ ml: 1 }}
                        onClick={() => handleViewSubmissions(material)}
                      >
                        View Submissions
                      </Button>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="primary" 
                      size="small"
                      onClick={() => handleOpenEditMaterialDialog(material)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

  const renderContent = () => {
    if (selectedWeek && selectedCourse) {
      return renderMaterialsList();
    } else if (selectedCourse) {
      return renderWeeksList();
    } else {
      return renderCoursesList();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Study Materials
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your course materials organized by week.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {renderContent()}
      
      {/* Week Dialog */}
      <Dialog open={weekDialogOpen} onClose={handleCloseWeekDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Week' : 'Edit Week'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Week Title"
            fullWidth
            variant="outlined"
            value={weekForm.title}
            onChange={handleWeekFormChange}
            sx={{ mb: 2, mt: 1 }}
          />
            <TextField
            margin="dense"
            name="description"
            label="Description"
              fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={weekForm.description}
            onChange={handleWeekFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
            margin="dense"
            name="week_number"
            label="Week Number"
            type="number"
            fullWidth
            variant="outlined"
            value={weekForm.week_number}
            onChange={handleWeekFormChange}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWeekDialog}>Cancel</Button>
          <Button onClick={handleSubmitWeek} variant="contained">
            {dialogMode === 'add' ? 'Add' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Material Dialog */}
      <Dialog open={materialDialogOpen} onClose={handleCloseMaterialDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Material' : 'Edit Material'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
            value={materialForm.title}
            onChange={handleMaterialFormChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={materialForm.description}
            onChange={handleMaterialFormChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Material Type</InputLabel>
            <Select
              name="material_type"
              value={materialForm.material_type}
              label="Material Type"
              onChange={handleMaterialFormChange}
            >
              <MenuItem value="drive_url">Google Drive</MenuItem>
              <MenuItem value="link">Web Link</MenuItem>
              <MenuItem value="assignment">Assignment</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="content"
            label={
              materialForm.material_type === 'link' 
                ? 'URL' 
                : materialForm.material_type === 'assignment'
                  ? 'Google Drive URL for Assignment PDF'
                  : 'Google Drive Link'
            }
            fullWidth
            variant="outlined"
            value={materialForm.content}
            onChange={handleMaterialFormChange}
            helperText={
              materialForm.material_type === 'assignment' 
                ? 'Provide a Google Drive URL to the assignment document that students will access' 
                : ''
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMaterialDialog}>Cancel</Button>
          <Button onClick={handleSubmitMaterial} variant="contained">
            {dialogMode === 'add' ? 'Add' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submissions Dialog */}
      <Dialog 
        open={submissionsDialogOpen} 
        onClose={handleCloseSubmissionsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedAssignment ? `Submissions for: ${selectedAssignment.title}` : 'Submissions'}
        </DialogTitle>
        <DialogContent>
          {loadingSubmissions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {submissionsError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submissionsError}
                </Alert>
              )}
              
              {submissions.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', my: 3 }}>
                  No submissions found for this assignment.
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Submission Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>{submission.student_id}</TableCell>
                          <TableCell>
                            {new Date(submission.submitted_at).toLocaleString()}
                          </TableCell>
                          <TableCell>{submission.status}</TableCell>
                          <TableCell>{submission.grade || 'Not graded'}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              href={submission.submission_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ mr: 1 }}
                            >
                              View Submission
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() => handleOpenGradingDialog(submission)}
                            >
                              Grade
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmissionsDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Grading Dialog */}
      <Dialog
        open={gradingDialogOpen}
        onClose={handleCloseGradingDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Grade Submission</DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Submission Link:</Typography>
                <Link 
                  href={selectedSubmission.submission_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedSubmission.submission_url}
                </Link>
              </Box>
              
              <TextField
                margin="dense"
                name="grade"
                label="Grade"
                fullWidth
                variant="outlined"
                value={gradeValue}
                onChange={handleGradeChange}
                placeholder="A, B, C, D, or numeric grade"
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="dense"
                name="feedback"
                label="Feedback"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={feedbackValue}
                onChange={handleFeedbackChange}
                placeholder="Provide feedback to the student"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGradingDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitGrade}
            variant="contained"
            color="primary"
          >
            Submit Grade
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudyMaterials; 