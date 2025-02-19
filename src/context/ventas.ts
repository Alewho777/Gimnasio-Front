import { Producto } from "./producto";

export interface Ventas{
    id?: number,
    producto: Producto,
    cantidad:number,
    total:number,
    fechaVenta?:string,
}

