import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../assets/services/authService'; 

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;