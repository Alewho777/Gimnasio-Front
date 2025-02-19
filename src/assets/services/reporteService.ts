import axios from "axios";
import { Reporte } from "../../context/reportes";
import { API_ROUTES } from "../../config/api";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "mui-sonner";

export const getReportes = async (): Promise<Reporte[]> => {
    try {
        const response = await axios.get<Reporte[]>(API_ROUTES.REPORTES);
        return response.data;
    } catch (error) {
        toast.error('ERROR al obtener los reportes.');
        throw new Error("Error al obtener los reportes");
    }
};

export const createReporte = async (reporteData: any): Promise<Reporte> => {
    try {
        // Validar estructura básica
        if (!reporteData.tipo || !reporteData.fecha) {
            toast.warning('Datos incompletos...');
            throw new Error("Datos incompletos para generar el reporte");
        }
        // const token = localStorage.getItem('token');
        const response = await axios.post<Reporte>(API_ROUTES.REPORTES, reporteData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Error al crear el reporte";
        toast.error('ERROR al crear el reporte.');
        throw new Error(errorMessage);
    }
};




// export const deleteReporte = async (id: number): Promise<void> => {
//     try {
//         await axios.delete(API_ROUTES.ELIMINAR_REPORTE(id));
//     } catch (error) {
//         console.error("Error deleting reporte:", error);
//         throw new Error("Error al eliminar el reporte");
//     }
// };


export const eliminarReporte = async (id: number): Promise<void> => {
    try {
        await axios.put<Reporte>(API_ROUTES.ELIMINAR_REPORTE(id));
    } catch (error) {
        toast.error('ERROR AL ELIMINAR EL REPORTE.');
        throw new Error("Error al eliminar el reporte");
    }
};


export interface RangoFechas {
    start: string;
    end: string;
    label: string;
}


export const calcularRangoFechas = (tipo: string, fecha: Dayjs): RangoFechas => {
    const start = tipo === 'dia' ? fecha.startOf('day') :
        tipo === 'mes' ? fecha.startOf('month') :
            fecha.startOf('year');

    const end = tipo === 'dia' ? fecha.endOf('day') :
        tipo === 'mes' ? fecha.endOf('month') :
            fecha.endOf('year');

    return {
        start: start.format('YYYY-MM-DD'),
        end: end.format('YYYY-MM-DD'),
        label: tipo === 'dia' ? start.format('DD/MM/YYYY') :
            tipo === 'mes' ? start.format('MMMM [de] YYYY') :
                start.format('YYYY')
    };
};
