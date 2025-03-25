import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import TeacherLayout from '../../components/layout/TeacherLayout';
import CourseWeekMaterials from '../../components/CourseWeekMaterials';

interface CourseWeek {
  id: number;
  course_id: number;
  title: string;
  description: string;
  week_number: number;
  created_at: string;
  updated_at: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-week-tabpanel-${index}`}
      aria-labelledby={`course-week-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `course-week-tab-${index}`,
    'aria-controls': `course-week-tabpanel-${index}`,
  };
}

const CourseMaterials: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isLecturer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [weeks, setWeeks] = useState<CourseWeek[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token || !courseId) {
          setError('Authentication or course information missing');
          setLoading(false);
          return;
        }

        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:8000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(courseResponse.data);

        // Fetch course weeks
        const weeksResponse = await axios.get(
          `http://localhost:8000/api/course-weeks/course/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        // Sort weeks by week_number
        const sortedWeeks = weeksResponse.data.sort(
          (a: CourseWeek, b: CourseWeek) => a.week_number - b.week_number
        );
        setWeeks(sortedWeeks);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }

    if (!course) {
      return (
        <Box sx={{ my: 4 }}>
          <Alert severity="warning">Course not found or access denied.</Alert>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Course Materials: {course.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {course.description}
          </Typography>
        </Box>

        {weeks.length === 0 ? (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">No weeks added to this course yet</Typography>
              {isLecturer && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Go to Course Management to add weeks to this course.
                </Typography>
              )}
            </Box>
          </Paper>
        ) : (
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="course weeks tabs"
              >
                {weeks.map((week, index) => (
                  <Tab 
                    key={week.id} 
                    label={`Week ${week.week_number}`} 
                    {...a11yProps(index)} 
                  />
                ))}
              </Tabs>
            </Box>
            
            {weeks.map((week, index) => (
              <TabPanel key={week.id} value={selectedTab} index={index}>
                <CourseWeekMaterials
                  courseId={parseInt(courseId || '0')}
                  weekId={week.id}
                  onRefresh={() => {}}
                />
              </TabPanel>
            ))}
          </Paper>
        )}
      </Box>
    );
  };

  return <TeacherLayout>{renderContent()}</TeacherLayout>;
};

export default CourseMaterials; 