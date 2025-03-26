import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id?: number;
  user_id?: number;
  // Student-specific
  enrollment_number?: string;
  semester?: number;
  program?: string;
  // Lecturer-specific
  department?: string;
  bio?: string;
  qualification?: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  lecturer_profile?: Profile;
  student_profile?: Profile;
}

interface UserFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  // Student profile
  enrollment_number?: string;
  semester?: number;
  program?: string;
  // Lecturer profile
  department?: string;
  bio?: string;
  qualification?: string;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form state
  const initialFormData: UserFormData = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    first_name: '',
    last_name: '',
    is_active: true,
  };
  
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<User[]>('http://localhost:8000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setSelectedUser(null);
    setFormData(initialFormData);
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (user: User) => {
    setDialogMode('edit');
    setSelectedUser(user);
    
    // Populate form data
    const userData: UserFormData = {
      email: user.email,
      username: user.username,
      password: '',
      confirmPassword: '',
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
    };
    
    // Add student-specific profile data
    if (user.role === 'student' && user.student_profile) {
      userData.enrollment_number = user.student_profile.enrollment_number;
      userData.semester = user.student_profile.semester;
      userData.program = user.student_profile.program;
    }
    
    // Add lecturer-specific profile data
    if (user.role === 'lecturer' && user.lecturer_profile) {
      userData.department = user.lecturer_profile.department;
      userData.bio = user.lecturer_profile.bio;
      userData.qualification = user.lecturer_profile.qualification;
    }
    
    setFormData(userData);
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  // Add a separate handler for Select components
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === 'true' ? true : value === 'false' ? false : value,
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Basic validations
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.username) errors.username = 'Username is required';
    if (dialogMode === 'add' && !formData.password) errors.password = 'Password is required';
    if (dialogMode === 'add' && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    
    // Role-specific validations
    if (formData.role === 'student') {
      if (!formData.enrollment_number) errors.enrollment_number = 'Enrollment number is required';
      if (!formData.program) errors.program = 'Program is required';
    }
    
    if (formData.role === 'lecturer') {
      if (!formData.department) errors.department = 'Department is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare the data to send
      const userData: any = {
        email: formData.email,
        username: formData.username,
        role: formData.role,
        first_name: formData.first_name,
        last_name: formData.last_name,
        is_active: formData.is_active,
      };
      
      // Add password for new users
      if (dialogMode === 'add') {
        userData.password = formData.password;
      }
      
      // Add profile data based on role
      if (formData.role === 'student') {
        userData.student_profile = {
          enrollment_number: formData.enrollment_number,
          semester: formData.semester,
          program: formData.program,
        };
      } else if (formData.role === 'lecturer') {
        userData.lecturer_profile = {
          department: formData.department,
          bio: formData.bio,
          qualification: formData.qualification,
        };
      }
      
      if (dialogMode === 'add') {
        // Create new user
        await axios.post(
          'http://localhost:8000/admin/users',
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setAlertMessage('User created successfully!');
      } else if (dialogMode === 'edit' && selectedUser) {
        // Update existing user
        await axios.put(
          `http://localhost:8000/admin/users/${selectedUser.id}`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setAlertMessage('User updated successfully!');
      }
      
      setAlertSeverity('success');
      setAlertOpen(true);
      handleCloseDialog();
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      setAlertMessage('Failed to save user. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/admin/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAlertMessage('User deleted successfully!');
      setAlertSeverity('success');
      setAlertOpen(true);
      
      handleCloseDeleteDialog();
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setAlertMessage('Failed to delete user. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Render role-specific form fields
  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'student':
        return (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Student Details
            </Typography>
            <TextField
              margin="dense"
              name="enrollment_number"
              label="Enrollment Number"
              fullWidth
              variant="outlined"
              value={formData.enrollment_number || ''}
              onChange={handleInputChange}
              error={!!formErrors.enrollment_number}
              helperText={formErrors.enrollment_number}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="semester"
              label="Semester"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.semester || ''}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="program"
              label="Program"
              fullWidth
              variant="outlined"
              value={formData.program || ''}
              onChange={handleInputChange}
              error={!!formErrors.program}
              helperText={formErrors.program}
            />
          </>
        );
      case 'lecturer':
        return (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Lecturer Details
            </Typography>
            <TextField
              margin="dense"
              name="department"
              label="Department"
              fullWidth
              variant="outlined"
              value={formData.department || ''}
              onChange={handleInputChange}
              error={!!formErrors.department}
              helperText={formErrors.department}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="qualification"
              label="Qualification"
              fullWidth
              variant="outlined"
              value={formData.qualification || ''}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="bio"
              label="Bio"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={formData.bio || ''}
              onChange={handleInputChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have access to the admin dashboard. Please contact an administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={fetchUsers}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenAddDialog}
            sx={{ mr: 1 }}
          >
            Add User
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                        color={
                          user.role === 'admin' 
                            ? 'secondary'
                            : user.role === 'lecturer' 
                              ? 'primary' 
                              : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.is_active ? 'Active' : 'Inactive'} 
                        color={user.is_active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEditDialog(user)} 
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(user)} 
                        size="small"
                        disabled={user.role === 'admin'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New User' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="first_name"
                label="First Name"
                fullWidth
                variant="outlined"
                value={formData.first_name}
                onChange={handleInputChange}
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                variant="outlined"
                value={formData.last_name}
                onChange={handleInputChange}
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
              />
            </Grid>
          </Grid>
          
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            sx={{ mb: 2, mt: 2 }}
          />
          
          <TextField
            margin="dense"
            name="username"
            label="Username"
            fullWidth
            variant="outlined"
            value={formData.username}
            onChange={handleInputChange}
            error={!!formErrors.username}
            helperText={formErrors.username}
            sx={{ mb: 2 }}
          />
          
          {dialogMode === 'add' && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="dense"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="dense"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                  />
                </Grid>
              </Grid>
            </>
          )}
          
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleSelectChange}
              disabled={dialogMode === 'edit'}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="lecturer">Lecturer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            <FormHelperText>
              {dialogMode === 'edit' ? 'Role cannot be changed after creation' : ''}
            </FormHelperText>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="is_active"
              value={formData.is_active ? "true" : "false"}
              label="Status"
              onChange={handleSelectChange}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
          
          {/* Role-specific fields */}
          {renderRoleSpecificFields()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'add' ? 'Add User' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user{' '}
            <strong>{userToDelete?.first_name} {userToDelete?.last_name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Snackbar */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard; 