import React, { useState } from 'react';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItemButton, ListItemIcon, ListItemText, useTheme, useMediaQuery, Badge, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  height: 'calc(100vh - 64px)',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: '24px',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '4px',
  },
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

const StudentLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Dummy notifications data
  const notifications = [
    { id: 1, text: 'New assignment posted in Mathematics 101', time: '2 hours ago' },
    { id: 2, text: 'Your submission for Physics Lab has been graded', time: '5 hours ago' },
    { id: 3, text: 'Upcoming quiz in Chemistry tomorrow', time: '1 day ago' },
  ];

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/student' },
    { text: 'Study Materials', icon: <BookIcon />, path: '/student/materials' },
    { text: 'Exams', icon: <AssignmentIcon />, path: '/student/exams' },
    { text: 'Tuition Fee', icon: <PaymentIcon />, path: '/student/tuition' },
    { text: 'Payments', icon: <PaymentIcon />, path: '/student/payments' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          LMS Student
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light + '20',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light + '30',
                },
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: theme.palette.error.main,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Student Dashboard'}
          </Typography>
          <IconButton color="inherit" onClick={handleNotificationClick} sx={{ color: 'text.primary' }}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            {user && (
              <Typography variant="body2" sx={{ mr: 1, color: 'text.primary' }}>
                {user.username}
              </Typography>
            )}
            <IconButton sx={{ color: 'text.primary' }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.username?.charAt(0).toUpperCase() || 'S'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Main open={!isMobile}>
        <Toolbar />
        <Outlet />
      </Main>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationClose}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {notification.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default StudentLayout; 