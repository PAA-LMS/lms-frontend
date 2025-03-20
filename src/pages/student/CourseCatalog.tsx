import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// Dummy data for demonstration
const courses = [
  {
    id: 1,
    name: 'Mathematics 101',
    instructor: 'Dr. Smith',
    subject: 'Mathematics',
    level: 'Beginner',
    duration: '12 weeks',
    rating: 4.5,
    enrolled: 120,
    capacity: 150,
    description: 'Introduction to basic mathematical concepts and problem-solving techniques.',
    prerequisites: ['None'],
  },
  {
    id: 2,
    name: 'Physics Lab',
    instructor: 'Prof. Johnson',
    subject: 'Physics',
    level: 'Intermediate',
    duration: '14 weeks',
    rating: 4.2,
    enrolled: 80,
    capacity: 100,
    description: 'Hands-on laboratory experiments in classical physics.',
    prerequisites: ['Physics 101'],
  },
  {
    id: 3,
    name: 'Chemistry 101',
    instructor: 'Dr. Williams',
    subject: 'Chemistry',
    level: 'Beginner',
    duration: '12 weeks',
    rating: 4.7,
    enrolled: 90,
    capacity: 120,
    description: 'Fundamental concepts of chemistry and laboratory techniques.',
    prerequisites: ['None'],
  },
  // Add more courses as needed
];

const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CourseCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubjectChange = (event: any) => {
    setSelectedSubject(event.target.value);
  };

  const handleLevelChange = (event: any) => {
    setSelectedLevel(event.target.value);
  };

  const handleEnrollClick = (course: any) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleEnrollConfirm = () => {
    // TODO: Implement actual enrollment logic
    setOpenDialog(false);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesSubject && matchesLevel;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Course Catalog
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={selectedSubject}
                label="Subject"
                onChange={handleSubjectChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={selectedLevel}
                label="Level"
                onChange={handleLevelChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                {levels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.instructor}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.subject} • {course.level}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.duration}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StarIcon sx={{ mr: 1, fontSize: 20, color: '#ffd700' }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.rating} ({course.enrolled} enrolled)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {course.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {course.prerequisites.map((prereq: string) => (
                    <Chip
                      key={prereq}
                      label={prereq}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleEnrollClick(course)}
                  disabled={course.enrolled >= course.capacity}
                >
                  {course.enrolled >= course.capacity ? 'Full' : 'Enroll Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Enrollment</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <Box sx={{ pt: 2 }}>
              <Typography>
                Are you sure you want to enroll in <strong>{selectedCourse.name}</strong>?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Instructor: {selectedCourse.instructor}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duration: {selectedCourse.duration}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleEnrollConfirm} color="primary" variant="contained">
            Confirm Enrollment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseCatalog; 