import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import CoursesList from '../../components/CoursesList';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const TeacherCourseManagement: React.FC = () => {
  const { isLecturer } = useAuth();

  // If not a lecturer, redirect to appropriate route
  if (!isLecturer) {
    return <Navigate to="/" />;
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Course Management
        </Typography>
        <Typography variant="body1" paragraph>
          Manage your courses, create new ones, and update course content.
        </Typography>
        
        <CoursesList />
      </Box>
    </Container>
  );
};

export default TeacherCourseManagement; 