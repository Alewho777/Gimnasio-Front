import axios from "axios";
import { toast } from "mui-sonner";
import { API_ROUTES } from "../../config/api";
import { Ventas } from "../../context/ventas";


export const getVentas = async (): Promise<Ventas[]> => {
    try {
        const response = await axios.get<Ventas[]>(API_ROUTES.VENTAS);
        return response.data;
    } catch (error) {
        console.error("Error fetching VENTAS:", error);
        throw new Error("Error al obtener Las VENTAS");
    }
};


export const createVenta = async (venta: Omit<Ventas, 'id' | 'fechaVenta'>): Promise<Ventas | null> => {

    try {

        const response = await axios.post<Ventas>(API_ROUTES.VENTAS, venta);
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

export const getVentasPorFecha = async (start: string, end: string): Promise<Ventas[]> => {
    try {
        const response = await axios.get<Ventas[]>(API_ROUTES.VENTAS_POR_FECHA, {
            params: { start, end }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching ventas por fecha:", error);
        throw new Error("Error al obtener ventas por fecha");
    }
};