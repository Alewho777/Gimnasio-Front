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