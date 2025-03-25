import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

// Dummy data for demonstration
const initialSettings = {
  twoFactorAuth: true,
  passwordExpiry: true,
  passwordExpiryDays: 90,
  sessionTimeout: true,
  sessionTimeoutMinutes: 30,
  loginAttempts: true,
  maxLoginAttempts: 5,
};

const initialAccessLogs = [
  {
    id: 1,
    timestamp: '2024-03-15 10:30:00',
    user: 'admin@example.com',
    action: 'Login',
    ip: '192.168.1.1',
    status: 'Success',
  },
  {
    id: 2,
    timestamp: '2024-03-15 09:15:00',
    user: 'user@example.com',
    action: 'Failed Login',
    ip: '192.168.1.2',
    status: 'Failed',
  },
];

const Security: React.FC = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [accessLogs, setAccessLogs] = useState(initialAccessLogs);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked,
    });
  };

  const handleNumberChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [setting]: parseInt(event.target.value),
    });
  };

  const handleSaveSettings = () => {
    // TODO: Implement actual settings save
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleViewLog = (log: any) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  const handleDeleteLog = (logId: number) => {
    setAccessLogs(accessLogs.filter(log => log.id !== logId));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Security Settings
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Security Configuration
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={settings.twoFactorAuth}
                onChange={handleSettingChange('twoFactorAuth')}
              />
            }
            label="Enable Two-Factor Authentication"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.passwordExpiry}
                onChange={handleSettingChange('passwordExpiry')}
              />
            }
            label="Enable Password Expiry"
          />
          {settings.passwordExpiry && (
            <TextField
              label="Password Expiry (days)"
              type="number"
              value={settings.passwordExpiryDays}
              onChange={handleNumberChange('passwordExpiryDays')}
              sx={{ mt: 1 }}
            />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={settings.sessionTimeout}
                onChange={handleSettingChange('sessionTimeout')}
              />
            }
            label="Enable Session Timeout"
          />
          {settings.sessionTimeout && (
            <TextField
              label="Session Timeout (minutes)"
              type="number"
              value={settings.sessionTimeoutMinutes}
              onChange={handleNumberChange('sessionTimeoutMinutes')}
              sx={{ mt: 1 }}
            />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={settings.loginAttempts}
                onChange={handleSettingChange('loginAttempts')}
              />
            }
            label="Enable Login Attempt Limiting"
          />
          {settings.loginAttempts && (
            <TextField
              label="Maximum Login Attempts"
              type="number"
              value={settings.maxLoginAttempts}
              onChange={handleNumberChange('maxLoginAttempts')}
              sx={{ mt: 1 }}
            />
          )}
        </FormGroup>
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          sx={{ mt: 2 }}
        >
          Save Settings
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Access Logs
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accessLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{log.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewLog(log)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteLog(log.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ pt: 2 }}>
              <Typography><strong>Timestamp:</strong> {selectedLog.timestamp}</Typography>
              <Typography><strong>User:</strong> {selectedLog.user}</Typography>
              <Typography><strong>Action:</strong> {selectedLog.action}</Typography>
              <Typography><strong>IP Address:</strong> {selectedLog.ip}</Typography>
              <Typography><strong>Status:</strong> {selectedLog.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Security; 