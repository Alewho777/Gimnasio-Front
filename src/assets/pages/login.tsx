import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Alert,
  Tooltip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  CircularProgress,
  CardMedia,
  Box
} from '@mui/material';
import { login } from '../services/authService';
import { Login as LoginIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { toast, Toaster } from 'mui-sonner';
import React from 'react';
import { getPersonas } from '../services/personaService';
import logoGF from "../images/logoGF.svg"


const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', contrasena: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(credentials.username, credentials.contrasena);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      await getPersonas();
      toast.success('Inicio de sesion EXITOSO!');
      navigate('/home');
    } catch (err) {
      toast.error('Usuario o Contraseña incorrectos');
      setCredentials({ username: '', contrasena: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box
  sx={{
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)',
    animation: 'Gradient 15s ease infinite',
    overflow:'hidden',
    '@keyframes Gradient': {
      '0%': {
    backgroundPosition: '0% 50%'
  },
  '50%': {
    backgroundPosition: '100% 50%'
  },
  '100%': {
    backgroundPosition: '0% 50%'
  }
    }
  }}
>
    <Container maxWidth="xs">
      <Toaster position="top-right" duration={3000} />
      <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
        <Box sx={{display:'flex', justifyContent:'center'}}>
          <CardMedia
            component='img'
            sx={{ height: "25vh", width: "20vw", objectFit: "cover", minWidth: "200px" }}
            image={logoGF}
          />
        </Box>
        <Typography variant="h4" align="center" gutterBottom >
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              onChange={(e) => setCredentials({ ...credentials, contrasena: e.target.value })}
              fullWidth
            />
          </FormControl>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Tooltip title="Iniciar Sesion" placement='right' disableInteractive>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              endIcon={!loading && <LoginIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
            </Button>
          </Tooltip>
        </form>
      </Paper>
    </Container>
    </Box>
  );
};

export default Login;