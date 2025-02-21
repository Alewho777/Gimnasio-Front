import axios from "axios";
import { API_ROUTES } from "../../config/api";
import { toast } from "mui-sonner";
import { Persona } from "../../context/persona";


export const getPersonas = async (): Promise<Persona[]> => {
  try {
    const response = await axios.get<Persona[]>(API_ROUTES.PERSONAS);
    return response.data;
  } catch (error) {
    console.error("Error fetching personas:", error);
    throw new Error("Error al obtener las personas");
  }
};

export const checkCedulaExists = async (cedula: string): Promise<boolean> => {
  try {
    const personas = await getPersonas();
    return personas.some(persona => persona.cedula === cedula);
  } catch (error) {
    toast.error("Error al verificar la cédula");
    return false;
  }
};

export const createPersona = async (persona: Omit<Persona, 'id' | 'estado' | 'estado_inscripcion'>): Promise<Persona | null> => {

  try {
    const exists = await checkCedulaExists(persona.cedula);
    if (exists) {
      toast.error("Cédula duplicada");
      return null;
    }

    const response = await axios.post<Persona>(API_ROUTES.PERSONAS, persona);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400) {
        toast.error("Datos inválidos, revisa la información");
      } else if (status === 401) {
        toast.error("No autorizado, inicia sesión");
      } else {
        toast.error("Error al crear la persona");
      }
    } else {
      toast.error("Error inesperado");
    }
    return null;
  }
};

export const eliminarPersona = async (cedula: String): Promise<void> => {
  try {
    await axios.put<Persona>(API_ROUTES.ELIMINAR_PERSONA(cedula));
  } catch {
    throw new Error("Error al eliminar a la persona");
  }
};

export const finalizarInscripcion = async (cedula: String): Promise<void> => {
  try {
    await axios.put<Persona>(API_ROUTES.FINALIZAR_INSCRIPCION(cedula));
  } catch {
    throw new Error("Error al eliminar a la persona");
  }
};

export const actualizarPersonaPorCedula = async (cedula: string, persona: Omit<Persona, 'id' | 'estado'>): Promise<void> => {
  try {
    await axios.put(
      API_ROUTES.ACTUALIZAR_PERSONA_CEDULA(cedula),
      {
        ...persona,
        cedula: cedula
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

export const getPersonasPorFecha = async (start: string, end: string): Promise<Persona[]> => {
  try {
      const response = await axios.get<Persona[]>(API_ROUTES.PERSONAS_POR_FECHA, {
          params: { start, end }
      });
      return response.data;
  } catch (error) {
      throw new Error("Error al obtener personas por fecha");
  }
};