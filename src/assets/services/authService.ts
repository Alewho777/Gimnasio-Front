import axios from 'axios';
import { API_ROUTES } from '../../config/api'; 

export const login = async (username: string, contrasena: string) => {
  try {
    const response = await axios.post(API_ROUTES.AUTH_LOGIN, { username:username, contrasena:contrasena });
    return {
      token: response.data.token,
      user: response.data.user
    };
  } catch (error) {
    throw new Error('Error de autenticación');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};