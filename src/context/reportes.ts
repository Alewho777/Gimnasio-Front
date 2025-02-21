export interface Reporte {
    id: number;
    numeroInforme: string;
    fechaGeneracion: string;
    estado: number;
    personas:string;
    ventas:string;
    filtrosAplicados: any;
}