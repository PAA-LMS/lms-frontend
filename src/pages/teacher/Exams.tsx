import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface Exam {
  id: string;
  courseName: string;
  title: string;
  description: string;
  examUrl: string;
  dueDate: string;
  status: 'active' | 'completed' | 'draft';
  submissions: number;
}

const Exams: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      courseName: 'Mathematics 101',
      title: 'Midterm Exam',
      description: 'Covers chapters 1-5',
      examUrl: 'https://drive.google.com/...',
      dueDate: '2024-03-20',
      status: 'active',
      submissions: 15,
    },
    // Add more dummy data as needed
  ]);

  const [newExam, setNewExam] = useState({
    courseName: '',
    title: '',
    description: '',
    examUrl: '',
    dueDate: '',
  });

  const handleCreateExam = () => {
    const exam: Exam = {
      id: Date.now().toString(),
      ...newExam,
      status: 'active',
      submissions: 0,
    };
    setExams([...exams, exam]);
    setOpenDialog(false);
    setNewExam({
      courseName: '',
      title: '',
      description: '',
      examUrl: '',
      dueDate: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Exams
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create New Exam
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Title</TableCell>
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
                <TableCell>{exam.dueDate}</TableCell>
                <TableCell>
                  <Chip
                    label={exam.status}
                    color={getStatusColor(exam.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{exam.submissions}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Exam</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Course Name"
              fullWidth
              value={newExam.courseName}
              onChange={(e) => setNewExam({ ...newExam, courseName: e.target.value })}
            />
            <TextField
              label="Exam Title"
              fullWidth
              value={newExam.title}
              onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newExam.description}
              onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
            />
            <TextField
              label="Exam URL (Google Drive)"
              fullWidth
              value={newExam.examUrl}
              onChange={(e) => setNewExam({ ...newExam, examUrl: e.target.value })}
            />
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              value={newExam.dueDate}
              onChange={(e) => setNewExam({ ...newExam, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateExam} variant="contained">
            Create Exam
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Exams; 