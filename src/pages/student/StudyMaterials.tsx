import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Breadcrumbs,
  Link,
  Grid,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  Image as ImageIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';

// Dummy data for demonstration
const materials = {
  'Week 1': {
    'Lecture Notes': [
      { id: 1, name: 'Introduction to Mathematics', type: 'pdf', completed: true },
      { id: 2, name: 'Basic Concepts', type: 'pdf', completed: false },
    ],
    'Videos': [
      { id: 3, name: 'Lecture 1.1', type: 'video', completed: true },
      { id: 4, name: 'Lecture 1.2', type: 'video', completed: false },
    ],
    'Assignments': [
      { id: 5, name: 'Problem Set 1', type: 'pdf', completed: true },
    ],
  },
  'Week 2': {
    'Lecture Notes': [
      { id: 6, name: 'Advanced Topics', type: 'pdf', completed: false },
    ],
    'Videos': [
      { id: 7, name: 'Lecture 2.1', type: 'video', completed: false },
    ],
  },
};

const StudyMaterials: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFolderClick = (folder: string) => {
    setCurrentPath([...currentPath, folder]);
  };

  const handleFileClick = (material: any) => {
    setSelectedMaterial(material);
    setOpenDialog(true);
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

  const filteredContent = Object.entries(getCurrentContent()).filter(([name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Study Materials
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link
            component="button"
            variant="body1"
            onClick={() => setCurrentPath([])}
            underline="hover"
            color="inherit"
          >
            Home
          </Link>
          {currentPath.map((path, index) => (
            <Link
              key={path}
              component="button"
              variant="body1"
              onClick={() => handleBreadcrumbClick(index)}
              underline="hover"
              color="inherit"
            >
              {path}
            </Link>
          ))}
        </Breadcrumbs>
      </Paper>

      <Paper>
        <List>
          {filteredContent.map(([name, content]) => (
            <ListItem key={name} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (Array.isArray(content)) {
                    handleFileClick({ name, ...content[0] });
                  } else {
                    handleFolderClick(name);
                  }
                }}
              >
                <ListItemIcon>
                  {Array.isArray(content) ? getFileIcon(content[0].type) : <FolderIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={name}
                  secondary={
                    Array.isArray(content) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Chip
                          icon={content[0].completed ? <CheckCircleIcon /> : <UncheckedIcon />}
                          label={content[0].completed ? 'Completed' : 'Not Completed'}
                          size="small"
                          color={content[0].completed ? 'success' : 'default'}
                        />
                      </Box>
                    )
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMaterial?.name}
        </DialogTitle>
        <DialogContent>
          {selectedMaterial && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Type: {selectedMaterial.type.toUpperCase()}
              </Typography>
              <Typography variant="body1">
                Status: {selectedMaterial.completed ? 'Completed' : 'Not Completed'}
              </Typography>
              {/* Add preview component based on file type */}
              <Box sx={{ mt: 2, height: 400, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Preview not available
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyMaterials;