import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Link
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { examsAPI, coursesAPI } from '../../services/api';
import { format } from 'date-fns';

interface Course {
  id: number;
  title: string;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  course_name: string;
  exam_url: string;
  due_date: string;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface ExamWithCourse extends Exam {
  courseName: string;
  submissions?: number;
}

interface ExamFormData {
  title: string;
  description: string;
  course_name: string;
  exam_url: string;
  due_date: Date;
}

interface ExamSubmissionDetails {
  id: number;
  exam_id: number;
  student_id: number;
  student_number: string;
  student_name: string;
  student_email: string;
  submission_url: string;
  status: string;
  grade: string | null;
  feedback: string | null;
  submitted_at: string;
  graded_at: string | null;
}

const Exams: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const [exams, setExams] = useState<ExamWithCourse[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmissionDetails[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamWithCourse | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    description: '',
    course_name: '',
    exam_url: '',
    due_date: new Date(),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all courses
      const coursesData = await coursesAPI.getLecturerCourses();
      setCourses(coursesData);
      console.log('Courses data:', coursesData);
      
      // Fetch all exams from each course
      let allExams: ExamWithCourse[] = [];
      
      for (const course of coursesData) {
        try {
          const courseExams = await examsAPI.getCourseExams(course.id);
          console.log(`Exams for course ${course.title}:`, courseExams);
          
          // Add course name to each exam
          const examsWithCourse = await Promise.all(courseExams.map(async (exam: Exam) => {
            // Try to get submissions count for each exam
            try {
              const submissions = await examsAPI.getExamSubmissions(exam.id);
              console.log(`Submissions for exam ${exam.id} (${exam.title}):`, submissions);
              
              // Make sure submissions is always an array, if backend returns nothing or other format
              let submissionsCount = 0;
              if (Array.isArray(submissions)) {
                submissionsCount = submissions.length;
              } else if (submissions && typeof submissions === 'object') {
                // If it's an object with a length property
                submissionsCount = (submissions as any).length || 0;
              }
              
              console.log(`Final submissions count for exam ${exam.id}: ${submissionsCount}`);
              
              return {
                ...exam,
                courseName: course.title,
                submissions: submissionsCount
              };
            } catch (error) {
              console.error(`Error fetching submissions for exam ${exam.id}:`, error);
              return {
                ...exam,
                courseName: course.title,
                submissions: 0
              };
            }
          }));
          
          allExams = [...allExams, ...examsWithCourse];
        } catch (error) {
          console.error(`Error fetching exams for course ${course.id}:`, error);
        }
      }
      
      console.log('All exams with submissions:', allExams);
      setExams(allExams);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load exams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.course_name.trim()) {
      errors.course_name = 'Course name is required';
    }
    
    if (!formData.exam_url.trim()) {
      errors.exam_url = 'Exam URL is required';
    }
    
    if (formData.due_date <= new Date()) {
      errors.due_date = 'Due date must be in the future';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateExam = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const examData = {
        ...formData,
        due_date: formData.due_date.toISOString()
      };
      
      if (selectedExam) {
        // Update existing exam
        await examsAPI.updateExam(selectedExam.id, examData);
        setSuccess('Exam updated successfully!');
      } else {
        // Create new exam
        await examsAPI.createExam(examData);
        setSuccess('Exam created successfully!');
      }
      
      setOpenDialog(false);
      resetForm();
      fetchData(); // Refresh the exams list
    } catch (err) {
      console.error('Error creating/updating exam:', err);
      setError('Failed to save exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: number) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setLoading(true);
      try {
        await examsAPI.deleteExam(examId);
        setSuccess('Exam deleted successfully!');
        fetchData(); // Refresh the exams list
      } catch (err) {
        console.error('Error deleting exam:', err);
        setError('Failed to delete exam. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditExam = (exam: ExamWithCourse) => {
    setSelectedExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description,
      course_name: exam.courseName,
      exam_url: '',
      due_date: new Date(exam.due_date)
    });
    setOpenDialog(true);
  };

  const resetForm = () => {
    setSelectedExam(null);
    setFormData({
      title: '',
      description: '',
      course_name: '',
      exam_url: '',
      due_date: new Date(),
    });
    setFormErrors({});
  };

  const getStatusColor = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (now < due) {
      return 'success'; // Active
    } else {
      return 'info'; // Completed
    }
  };

  const getStatus = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (now < due) {
      return 'Active';
    } else {
      return 'Completed';
    }
  };

  const handleViewSubmissions = async (exam: ExamWithCourse) => {
    setSelectedExam(exam);
    setLoading(true);
    try {
      const submissionsData = await examsAPI.getExamSubmissions(exam.id);
      console.log('Submissions data:', submissionsData);
      
      // Ensure we have a valid array of submissions
      const submissionsArray = Array.isArray(submissionsData) ? submissionsData : [];
      setSubmissions(submissionsArray);
      
      setOpenSubmissionsDialog(true);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Exams
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          Create Exam
        </Button>
      </Box>

      {loading && !openSubmissionsDialog && <CircularProgress />}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {!loading && exams.length === 0 ? (
        <Alert severity="info">No exams found. Create your first exam!</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.courseName}</TableCell>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.description}</TableCell>
                  <TableCell>{format(new Date(exam.due_date), 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatus(exam.due_date)}
                      color={getStatusColor(exam.due_date)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {exam.submissions || 0}
                      </Typography>
                      {(exam.submissions || 0) > 0 && (
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewSubmissions(exam)}
                        >
                          <AssessmentIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => {
                        if (exam.exam_url) {
                          window.open(exam.exam_url, '_blank');
                        } else {
                          alert('No exam URL available');
                        }
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditExam(exam)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog 
          open={openDialog} 
          onClose={() => {
            setOpenDialog(false);
            resetForm();
          }} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>{selectedExam ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth error={!!formErrors.course_name}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={formData.course_name}
                  label="Course"
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                >
                  <MenuItem value={''} disabled>Select a course</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.title}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.course_name && <FormHelperText>{formErrors.course_name}</FormHelperText>}
              </FormControl>

              <TextField
                label="Exam Title"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
              
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
              
              <DateTimePicker
                label="Due Date & Time"
                value={formData.due_date}
                onChange={(newValue) => newValue && setFormData({ ...formData, due_date: newValue })}
                slotProps={{
                  textField: {
                    error: !!formErrors.due_date,
                    helperText: formErrors.due_date
                  }
                }}
              />
              
              <TextField
                label="Exam URL"
                fullWidth
                value={formData.exam_url}
                onChange={(e) => setFormData({ ...formData, exam_url: e.target.value })}
                error={!!formErrors.exam_url}
                helperText={formErrors.exam_url}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateExam} 
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (selectedExam ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>

      <Dialog
        open={openSubmissionsDialog}
        onClose={() => {
          setOpenSubmissionsDialog(false);
          setSelectedExam(null);
          setSubmissions([]);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Submissions for: {selectedExam?.title}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : submissions.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>No submissions found for this exam.</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Student Number</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Submission Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.student_name}</TableCell>
                      <TableCell>{submission.student_number}</TableCell>
                      <TableCell>{submission.student_email}</TableCell>
                      <TableCell>
                        {format(new Date(submission.submitted_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={submission.status}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {submission.grade || 'Not graded'}
                      </TableCell>
                      <TableCell>
                        <Link 
                          href={submission.submission_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View Submission
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmissionsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Exams; 