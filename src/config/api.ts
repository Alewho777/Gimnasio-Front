const API_URL = import.meta.env.VITE_API_URL;

export const API_ROUTES = {
  PERSONAS: `${API_URL}/personas`,
  ELIMINAR_PERSONA: (cedula: String) => `${API_URL}/personas/desactivar/${cedula}`,
  FINALIZAR_INSCRIPCION: (cedula: String) => `${API_URL}/personas/desactivarInscripcion/${cedula}`,
  ACTUALIZAR_PERSONA_CEDULA: (cedula: string) => `${API_URL}/personas/updateByCedula/${cedula}`,
  PRODUCTOS: `${API_URL}/productos`,
  BUSCAR_PRODUCTO_CODIGO:(codigo:String) =>`${API_URL}/productos/findByCodigo/${codigo}` ,
  ELIMINAR_PRODUCTO: (codigo: String) => `${API_URL}/productos/desactivar/${codigo}`,
  ACTUALIZAR_PRODUCTO_CODIGO: (codigo: string) => `${API_URL}/productos/updateByCodigo/${codigo}`,
  VENTAS: `${API_URL}/ventas`,
  REPORTES: `${API_URL}/reportes`,
  ELIMINAR_REPORTE: (id: number) => `${API_URL}/reportes/desactivarReporte/${id}`,
  PERSONAS_POR_FECHA: `${API_URL}/personas/por-fecha`,
  VENTAS_POR_FECHA: `${API_URL}/ventas/por-fecha`,
  ACTUALIZAR_ESTADOS_INSCRIPCION: `${API_URL}/personas/actualizar-estados`,
  AUTH_LOGIN: `${API_URL}/auth/login`,
};
