import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
  Chip,
  Avatar,
  Menu,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  Image as ImageIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Upload as UploadIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

// Dummy data for demonstration
const materials = {
  'Week 1': {
    'Lecture Notes': [
      { id: 1, name: 'Introduction to Mathematics', type: 'pdf', size: '2.5 MB', access: 'public' },
      { id: 2, name: 'Basic Concepts', type: 'pdf', size: '1.8 MB', access: 'private' },
    ],
    'Videos': [
      { id: 3, name: 'Lecture 1.1', type: 'video', size: '45 MB', access: 'public' },
      { id: 4, name: 'Lecture 1.2', type: 'video', size: '52 MB', access: 'public' },
    ],
    'Assignments': [
      { id: 5, name: 'Problem Set 1', type: 'pdf', size: '1.2 MB', access: 'private' },
    ],
  },
  'Week 2': {
    'Lecture Notes': [
      { id: 6, name: 'Advanced Topics', type: 'pdf', size: '3.1 MB', access: 'public' },
    ],
    'Videos': [
      { id: 7, name: 'Lecture 2.1', type: 'video', size: '48 MB', access: 'public' },
    ],
  },
};

const StudyMaterials: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    access: 'public',
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log('Files dropped:', acceptedFiles);
      // TODO: Implement file upload logic
    },
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      description: '',
      access: 'public',
    });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, material: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedMaterial(material);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMaterial(null);
  };

  const handleFolderClick = (folder: string) => {
    setCurrentPath([...currentPath, folder]);
  };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const getCurrentContent = () => {
    let content = materials;
    for (const path of currentPath) {
      content = content[path];
    }
    return content;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon />;
      case 'video':
        return <VideoIcon />;
      case 'image':
        return <ImageIcon />;
      default:
        return <FileIcon />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Study Materials
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CreateNewFolderIcon />}
            onClick={handleOpenDialog}
          >
            New Folder
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            {...getRootProps()}
          >
            Upload Files
          </Button>
          <input {...getInputProps()} />
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Current Path:
          </Typography>
          <Typography
            variant="body2"
            sx={{ cursor: 'pointer', color: 'primary.main' }}
            onClick={() => setCurrentPath([])}
          >
            Home
          </Typography>
          {currentPath.map((path, index) => (
            <React.Fragment key={path}>
              <Typography variant="body2" color="text.secondary">/</Typography>
              <Typography
                variant="body2"
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => handleBreadcrumbClick(index)}
              >
                {path}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
        {isDragActive && (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: 'primary.light',
            }}
          >
            <Typography variant="body1" color="primary">
              Drop files here to upload
            </Typography>
          </Box>
        )}
      </Paper>

      <Grid container spacing={2}>
        {Object.entries(getCurrentContent()).map(([name, content]) => (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <Paper
              sx={{
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => {
                if (Array.isArray(content)) {
                  setSelectedMaterial({ name, ...content[0] });
                  setOpenDialog(true);
                } else {
                  handleFolderClick(name);
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {Array.isArray(content) ? getFileIcon(content[0].type) : <FolderIcon />}
                </ListItemIcon>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {name}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuClick(e, { name, ...(Array.isArray(content) ? content[0] : {}) });
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              {Array.isArray(content) && (
                <Box sx={{ ml: 7 }}>
                  <Typography variant="body2" color="text.secondary">
                    {content.length} items
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      icon={content[0].access === 'public' ? <LockOpenIcon /> : <LockIcon />}
                      label={content[0].access}
                      size="small"
                      color={content[0].access === 'public' ? 'success' : 'warning'}
                    />
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Material Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMaterial ? 'Material Details' : 'Create New Folder'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Access</InputLabel>
              <Select
                name="access"
                value={formData.access}
                onChange={(e) => setFormData({ ...formData, access: e.target.value })}
                label="Access"
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCloseDialog} variant="contained">
            {selectedMaterial ? 'Save Changes' : 'Create Folder'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Material Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StudyMaterials; 