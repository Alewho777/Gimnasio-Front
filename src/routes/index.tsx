import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../assets/pages/home";
// import Dashboard from "../assets/pages/dashboard";
import Layout from "../layouts/layout";
import Login from "../assets/pages/login";
import PrivateRoute from "./PrivateRoute";
import PersonaForm from "../componentes/personaForms";
import PersonaTable from "../componentes/personaTable";
import PersonasControl from "../assets/pages/personasControl";
import ProductosControl from "../assets/pages/productosControl";
import ProductoForm from "../componentes/productoForms";
import ProductoTable from "../componentes/productoTable";
import VentasRegistro from "../componentes/ventasRegistro";
import VentasControl from "../assets/pages/ventasControl";
import ReporteTable from "../componentes/reporteTable";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="personas" element={<PrivateRoute><PersonasControl /></PrivateRoute>} />
          <Route path="productos" element={<PrivateRoute><ProductosControl /></PrivateRoute>} />
          <Route path="ventas" element={<PrivateRoute><VentasControl /></PrivateRoute>} />
          <Route path="personas/crear" element={<PrivateRoute><PersonaForm /></PrivateRoute>} />
          <Route path="personas/gestion" element={<PrivateRoute><PersonaTable /></PrivateRoute>} />
          <Route path="productos/crear" element={<PrivateRoute><ProductoForm /></PrivateRoute>} />
          <Route path="productos/gestion" element={<PrivateRoute><ProductoTable /></PrivateRoute>} />
          <Route path="ventas/gestion" element={<PrivateRoute><VentasRegistro /></PrivateRoute>} />
          <Route path="reportes/gestion" element={<PrivateRoute><ReporteTable /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
