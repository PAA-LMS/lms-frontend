import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import TeacherLayout from './components/layout/TeacherLayout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import Analytics from './pages/Analytics';
import Security from './pages/Security';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import CourseCatalog from './pages/student/CourseCatalog';
import StudyMaterials from './pages/student/StudyMaterials';
import TuitionFee from './pages/student/TuitionFee';
import StudentExams from './pages/student/Exams';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherCourseManagement from './pages/teacher/CourseManagement';
import TeacherStudyMaterials from './pages/teacher/StudyMaterials';
import TeacherCourseMaterials from './pages/teacher/CourseMaterials';
import TeacherExams from './pages/teacher/Exams';
import LoginPage from './pages/loginPage/login';
import SignupPage from './pages/signupPage/signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import TeacherFinanceManagement from './pages/teacher/FinanceManagement';
import StudentPayments from './pages/student/Payments';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 24,
        },
      },
    },
  },
});

// Protected route component
interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'lecturer') {
      return <Navigate to="/teacher" replace />;
    } else if (user?.role === 'student') {
      return <Navigate to="/student" replace />;
    } else if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return element;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLecturer, isStudent } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? (
        isLecturer ? <Navigate to="/teacher" replace /> : 
        isStudent ? <Navigate to="/student" replace /> : 
        <Navigate to="/admin" replace />
      ) : <LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={<ProtectedRoute element={<AdminLayout />} />}>
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* Student Routes */}
      <Route 
        path="/student/*" 
        element={<ProtectedRoute element={<StudentLayout />} requiredRole="student" />}
      >
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<CourseCatalog />} />
        <Route path="materials" element={<StudyMaterials />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="tuition" element={<TuitionFee />} />
        <Route path="payments" element={<StudentPayments />} />
      </Route>

      {/* Teacher/Lecturer Routes */}
      <Route 
        path="/teacher/*" 
        element={<ProtectedRoute element={<TeacherLayout />} requiredRole="lecturer" />}
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="courses" element={<TeacherCourseManagement />} />
        <Route path="materials" element={<TeacherStudyMaterials />} />
        <Route path="course/:courseId/materials" element={<TeacherCourseMaterials />} />
        <Route path="exams" element={<TeacherExams />} />
        <Route path="finance" element={<TeacherFinanceManagement />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App; 