import { Persona } from "./persona";
import { Ventas } from "./ventas";

export interface Reporte {
    id: number;
    numeroInforme: string;
    fechaGeneracion: string;
    estado: number;
    // personas: Persona[];
    // ventas: Ventas[];
    personas:string;
    ventas:string;
    filtrosAplicados: any;
}