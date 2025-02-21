import axios from "axios";
import { toast } from "mui-sonner";
import { API_ROUTES } from "../../config/api";
import { Producto } from "../../context/producto";


export const getProductos = async (): Promise<Producto[]> => {
    try {
        const response = await axios.get<Producto[]>(API_ROUTES.PRODUCTOS);
        return response.data;
    } catch (error) {
        throw new Error("Error al obtener LOS PRODUCTOS");
    }
};

export const getProductoByCodigo = async (codigo: string | number): Promise<Producto> => {
    try {
        const response = await axios.get<Producto>(
            API_ROUTES.BUSCAR_PRODUCTO_CODIGO(codigo.toString()),
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                validateStatus: (status) => status === 200 || status === 404
            }
        );

        if (response.status === 404) {
            throw new Error("Producto no encontrado");
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw error;
    }
};


export const checkCodigoExists = async (codigo: string): Promise<boolean> => {
    try {
        const productos = await getProductos();
        return productos.some(producto => producto.codigo === codigo);
    } catch (error) {
        toast.error("Error al verificar el codigo");
        return false;
    }
};

export const createProducto = async (producto: Omit<Producto, 'id' | 'estado'>): Promise<Producto | null> => {

    try {
        const exists = await checkCodigoExists(producto.codigo);
        if (exists) {
            toast.error("Codigo duplicado");
            return null;
        }

        const response = await axios.post<Producto>(API_ROUTES.PRODUCTOS, producto);
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

export const eliminarProducto = async (codigo: String): Promise<void> => {
    try {
        await axios.put<Producto>(API_ROUTES.ELIMINAR_PRODUCTO(codigo));
    } catch {
        throw new Error("Error al eliminar el producto");
    }
};

export const actualizarProductoPorCodigo = async (codigo: string, producto: Omit<Producto, 'id' | 'estado'>): Promise<void> => {
    try {
        await axios.put(
            API_ROUTES.ACTUALIZAR_PRODUCTO_CODIGO(codigo),
            {
                ...producto,
                codigo: codigo
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