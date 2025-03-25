import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  InsertDriveFile as FileIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface CourseMaterial {
  id: number;
  title: string;
  description: string;
  material_type: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

interface CourseWeek {
  id: number;
  title: string;
  description: string;
  week_number: number;
}

interface CourseWeekMaterialsProps {
  courseId: number;
  weekId: number;
  onRefresh?: () => void;
}

const CourseWeekMaterials: React.FC<CourseWeekMaterialsProps> = ({
  courseId,
  weekId,
  onRefresh,
}) => {
  const { user, isLecturer } = useAuth();
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [courseWeek, setCourseWeek] = useState<CourseWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentMaterial, setCurrentMaterial] = useState<CourseMaterial | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    material_type: 'link',
    content: '',
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      material_type: 'link',
      content: '',
    });
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch the course week details
      const weekResponse = await axios.get(`http://localhost:8000/api/course-weeks/${weekId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseWeek(weekResponse.data);

      // Fetch materials for the week
      const materialsResponse = await axios.get(
        `http://localhost:8000/api/course-materials/week/${weekId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMaterials(materialsResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching course materials:', err);
      setError('Failed to load course materials. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weekId) {
      fetchMaterials();
    }
  }, [weekId]);

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    resetForm();
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (material: CourseMaterial) => {
    setDialogMode('edit');
    setCurrentMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      material_type: material.material_type,
      content: material.content,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (dialogMode === 'add') {
        // Create new material
        await axios.post(
          'http://localhost:8000/api/course-materials/',
          {
            ...formData,
            week_id: weekId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setAlertMessage('Course material added successfully!');
        setAlertSeverity('success');
      } else {
        // Update existing material
        await axios.put(
          `http://localhost:8000/api/course-materials/${currentMaterial?.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setAlertMessage('Course material updated successfully!');
        setAlertSeverity('success');
      }
      
      handleCloseDialog();
      fetchMaterials();
      if (onRefresh) onRefresh();
      setAlertOpen(true);
    } catch (err) {
      console.error('Error saving course material:', err);
      setAlertMessage('Failed to save course material. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(`http://localhost:8000/api/course-materials/${materialId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setAlertMessage('Course material deleted successfully!');
        setAlertSeverity('success');
        setAlertOpen(true);
        
        fetchMaterials();
        if (onRefresh) onRefresh();
      } catch (err) {
        console.error('Error deleting course material:', err);
        setAlertMessage('Failed to delete course material. Please try again.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'link':
        return <LinkIcon />;
      case 'drive_url':
      case 'gdrive':
        return <FileIcon />;
      default:
        return <FileIcon />;
    }
  };

  const getMaterialTypeLabel = (type: string) => {
    switch (type) {
      case 'link':
        return 'Web Link';
      case 'drive_url':
      case 'gdrive':
        return 'Google Drive';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

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

  return (
    <Box sx={{ mt: 2 }}>
      {courseWeek && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {courseWeek.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {courseWeek.description}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Course Materials</Typography>
        {isLecturer && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add Material
          </Button>
        )}
      </Box>

      {materials.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ my: 4, textAlign: 'center' }}>
          No materials available for this week yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {materials.map((material) => (
            <Grid item xs={12} key={material.id}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ mr: 1 }}>{getMaterialTypeIcon(material.material_type)}</Box>
                        <Typography variant="h6">{material.title}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {material.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Type: {getMaterialTypeLabel(material.material_type)}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          href={material.content}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Material
                        </Button>
                      </Box>
                    </Grid>
                    
                    {isLecturer && (
                      <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenEditDialog(material)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteMaterial(material.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Course Material' : 'Edit Course Material'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleTextInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleTextInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Material Type</InputLabel>
            <Select
              name="material_type"
              value={formData.material_type}
              label="Material Type"
              onChange={handleSelectChange}
            >
              <MenuItem value="link">Web Link</MenuItem>
              <MenuItem value="drive_url">Google Drive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="content"
            label={formData.material_type === 'link' ? 'URL' : 'Google Drive Link'}
            fullWidth
            variant="outlined"
            value={formData.content}
            onChange={handleTextInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'add' ? 'Add' : 'Save Changes'}
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

export default CourseWeekMaterials; 