import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download as DownloadIcon } from '@mui/icons-material';

// Dummy data for demonstration
const userActivityData = [
  { month: 'Jan', logins: 1200, enrollments: 150, submissions: 450 },
  { month: 'Feb', logins: 1400, enrollments: 180, submissions: 520 },
  { month: 'Mar', logins: 1600, enrollments: 220, submissions: 580 },
  { month: 'Apr', logins: 1800, enrollments: 250, submissions: 620 },
  { month: 'May', logins: 2000, enrollments: 280, submissions: 680 },
  { month: 'Jun', logins: 2200, enrollments: 300, submissions: 720 },
];

const courseEnrollmentData = [
  { name: 'Programming', value: 400 },
  { name: 'Design', value: 300 },
  { name: 'Marketing', value: 200 },
  { name: 'Business', value: 250 },
  { name: 'Science', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [reportType, setReportType] = useState('all');

  const handleExport = (format: 'csv' | 'pdf') => {
    // TODO: Implement export functionality
    console.log(`Exporting ${format} report for ${timeRange} time range`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <Box>
          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="1month">Last Month</MenuItem>
              <MenuItem value="3months">Last 3 Months</MenuItem>
              <MenuItem value="6months">Last 6 Months</MenuItem>
              <MenuItem value="1year">Last Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="all">All Data</MenuItem>
              <MenuItem value="users">User Activity</MenuItem>
              <MenuItem value="courses">Course Stats</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('csv')}
            sx={{ mr: 1 }}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('pdf')}
          >
            PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* User Activity Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Activity Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="logins"
                    stroke="#8884d8"
                    name="Logins"
                  />
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#82ca9d"
                    name="Enrollments"
                  />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke="#ffc658"
                    name="Submissions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Course Enrollment Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Enrollment Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseEnrollmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {courseEnrollmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Key Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Metrics
            </Typography>
            <Grid container spacing={2}>
              {[
                { title: 'Total Users', value: '2,500', change: '+12%' },
                { title: 'Active Courses', value: '45', change: '+5%' },
                { title: 'Completion Rate', value: '85%', change: '+3%' },
                { title: 'Average Score', value: '78%', change: '+2%' },
              ].map((metric) => (
                <Grid item xs={6} key={metric.title}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        {metric.title}
                      </Typography>
                      <Typography variant="h5">{metric.value}</Typography>
                      <Typography
                        variant="body2"
                        color={metric.change.startsWith('+') ? 'success.main' : 'error.main'}
                      >
                        {metric.change} from last period
                      </Typography>
                    </CardContent>
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

export default Analytics; 