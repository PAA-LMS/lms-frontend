import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

interface Exam {
  id: string;
  courseName: string;
  title: string;
  description: string;
  examUrl: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  feedback?: string;
}

const Exams: React.FC = () => {
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');

  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      courseName: 'Mathematics 101',
      title: 'Midterm Exam',
      description: 'Covers chapters 1-5',
      examUrl: 'https://drive.google.com/...',
      dueDate: '2024-03-20',
      status: 'pending',
    },
    {
      id: '2',
      courseName: 'Physics 101',
      title: 'Final Exam',
      description: 'Comprehensive exam covering all topics',
      examUrl: 'https://drive.google.com/...',
      dueDate: '2024-04-15',
      status: 'graded',
      grade: 'A',
      feedback: 'Excellent work!',
    },
  ]);

  const handleSubmitExam = () => {
    if (selectedExam) {
      setExams(exams.map(exam => 
        exam.id === selectedExam.id 
          ? { ...exam, status: 'submitted' }
          : exam
      ));
      setOpenSubmitDialog(false);
      setSubmissionUrl('');
      setSelectedExam(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'submitted':
        return 'info';
      case 'graded':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Exams
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>{exam.courseName}</TableCell>
                <TableCell>{exam.title}</TableCell>
                <TableCell>{exam.dueDate}</TableCell>
                <TableCell>
                  <Chip
                    label={exam.status}
                    color={getStatusColor(exam.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{exam.grade || '-'}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => window.open(exam.examUrl, '_blank')}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {exam.status === 'pending' && (
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

      <Dialog
        open={openSubmitDialog}
        onClose={() => {
          setOpenSubmitDialog(false);
          setSelectedExam(null);
          setSubmissionUrl('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Exam</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedExam?.title} - {selectedExam?.courseName}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {selectedExam?.description}
            </Typography>
            <TextField
              label="Submission URL (Google Drive)"
              fullWidth
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenSubmitDialog(false);
              setSelectedExam(null);
              setSubmissionUrl('');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitExam}
            variant="contained"
            disabled={!submissionUrl}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Exams; 