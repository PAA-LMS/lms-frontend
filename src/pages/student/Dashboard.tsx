import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// Dummy data for demonstration
const currentCourses = [
  { id: 1, name: 'Mathematics 101', progress: 75, instructor: 'Dr. Smith', color: '#2196f3' },
  { id: 2, name: 'Physics Lab', progress: 60, instructor: 'Prof. Johnson', color: '#f50057' },
  { id: 3, name: 'Chemistry 101', progress: 45, instructor: 'Dr. Williams', color: '#4caf50' },
];

const upcomingAssignments = [
  { id: 1, title: 'Math Quiz 3', course: 'Mathematics 101', dueDate: '2024-03-25', priority: 'high' },
  { id: 2, title: 'Physics Lab Report', course: 'Physics Lab', dueDate: '2024-03-26', priority: 'medium' },
  { id: 3, title: 'Chemistry Project', course: 'Chemistry 101', dueDate: '2024-03-28', priority: 'low' },
];

const recentGrades = [
  { id: 1, course: 'Mathematics 101', assignment: 'Quiz 2', grade: 'A', date: '2024-03-20' },
  { id: 2, course: 'Physics Lab', assignment: 'Lab Report 1', grade: 'B+', date: '2024-03-19' },
  { id: 3, course: 'Chemistry 101', assignment: 'Midterm', grade: 'A-', date: '2024-03-18' },
];

const Dashboard: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Welcome back, Student!
        </Typography>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Current Courses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                Current Courses
              </Typography>
              <Button size="small" color="primary">
                View All
              </Button>
            </Box>
            <List>
              {currentCourses.map((course) => (
                <ListItem key={course.id} sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: course.color + '20', color: course.color }}>
                      <SchoolIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {course.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Instructor: {course.instructor}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Box sx={{ flexGrow: 1, mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={course.progress}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: course.color + '20',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: course.color,
                                },
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {course.progress}%
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Assignments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'error.main' }} />
                Upcoming Assignments
              </Typography>
              <Button size="small" color="primary">
                View All
              </Button>
            </Box>
            <List>
              {upcomingAssignments.map((assignment) => (
                <ListItem key={assignment.id} sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: getPriorityColor(assignment.priority) + '20', color: getPriorityColor(assignment.priority) }}>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {assignment.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Course: {assignment.course}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Due: {assignment.dueDate}
                        </Typography>
                      </Box>
                    }
                  />
                  <Chip
                    label={assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                    color={getPriorityColor(assignment.priority)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Grades */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <GradeIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'success.main' }} />
                Recent Grades
              </Typography>
              <Button size="small" color="primary">
                View All
              </Button>
            </Box>
            <Grid container spacing={2}>
              {recentGrades.map((grade) => (
                <Grid item xs={12} sm={6} md={4} key={grade.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                          <GradeIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {grade.grade}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {grade.assignment}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        {grade.course}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Graded on: {grade.date}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 