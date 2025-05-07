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
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { examsAPI, coursesAPI } from '../../services/api';
import { format } from 'date-fns';

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

interface Course {
  id: number;
  title: string;
}

interface ExamWithCourse extends Exam {
  courseName: string;
  submitted?: boolean;
}

interface ExamSubmission {
  submission_url: string;
}

const Exams: React.FC = () => {
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamWithCourse | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [exams, setExams] = useState<ExamWithCourse[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all courses first
      const coursesData = await coursesAPI.getAllCourses();
      setCourses(coursesData);
      
      // Fetch all exams from each course and combine them
      let allExams: ExamWithCourse[] = [];
      
      for (const course of coursesData) {
        try {
          const courseExams = await examsAPI.getCourseExams(course.id);
          
          // Add course name to each exam and check submission status
          const examsWithCourse = await Promise.all(courseExams.map(async (exam: Exam) => {
            // Check if exam is already submitted
            let submitted = false;
            try {
              const submissionStatus = await examsAPI.checkSubmissionStatus(exam.id);
              submitted = submissionStatus.submitted;
            } catch (error) {
              console.error(`Error checking submission status for exam ${exam.id}:`, error);
            }
            
            return {
              ...exam,
              courseName: course.title,
              submitted: submitted
            };
          }));
          
          allExams = [...allExams, ...examsWithCourse];
        } catch (error) {
          console.error(`Error fetching exams for course ${course.id}:`, error);
        }
      }
      
      setExams(allExams);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load exams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExam = async () => {
    if (selectedExam && answers['submission_url']) {
      setLoading(true);
      try {
        const submission: ExamSubmission = {
          submission_url: answers['submission_url']
        };
        
        await examsAPI.submitExam(selectedExam.id, submission);
        
        setSuccess('Exam submitted successfully!');
        setOpenSubmitDialog(false);
        setAnswers({});
        setSelectedExam(null);
        
        // Refresh the exams list
        fetchData();
      } catch (err) {
        console.error('Error submitting exam:', err);
        setError('Failed to submit exam. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please provide a submission URL');
    }
  };

  const getStatusColor = (dueDate: string, status: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (status === 'active' && now < due) {
      return 'success'; // Active
    } else if (status === 'active' && now >= due) {
      return 'error'; // Expired
    } else {
      return 'info'; // Other status
    }
  };

  const getStatus = (dueDate: string, status: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (status === 'active' && now < due) {
      return 'Active';
    } else if (status === 'active' && now >= due) {
      return 'Expired';
    } else {
      return status.charAt(0).toUpperCase() + status.slice(1); // Capitalize status
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Exams
      </Typography>

      {loading && <CircularProgress />}
      
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
        <Alert severity="info">No exams available at this time.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.courseName}</TableCell>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{format(new Date(exam.due_date), 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <Chip
                      label={exam.submitted ? 'Submitted' : getStatus(exam.due_date, exam.status)}
                      color={exam.submitted ? 'info' : getStatusColor(exam.due_date, exam.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {exam.exam_url && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          window.open(exam.exam_url, '_blank');
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    )}
                    {getStatus(exam.due_date, exam.status) === 'Active' && !exam.submitted && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedExam(exam);
                          setOpenSubmitDialog(true);
                        }}
                      >
                        <UploadIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openSubmitDialog}
        onClose={() => {
          setOpenSubmitDialog(false);
          setSelectedExam(null);
          setAnswers({});
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Submit Exam: {selectedExam?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedExam?.title} - {selectedExam?.courseName}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {selectedExam?.description}
            </Typography>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Submission
            </Typography>
            
            <TextField
              label="Google Drive Link"
              fullWidth
              value={answers['submission_url'] || ''}
              onChange={(e) => setAnswers({...answers, 'submission_url': e.target.value})}
              margin="normal"
              placeholder="Paste your Google Drive link with your completed exam here"
              helperText="Make sure your document is accessible to viewers with the link"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenSubmitDialog(false);
              setSelectedExam(null);
              setAnswers({});
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitExam}
            variant="contained"
            disabled={loading || !answers['submission_url']}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Exams; 