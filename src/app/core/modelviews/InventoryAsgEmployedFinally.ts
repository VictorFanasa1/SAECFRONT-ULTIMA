import { Guid } from "guid-typescript";

export interface InventoryAsgEmployedFinally
{
    uiAsignacion: Guid,
    uiNumeroEmpleado: number,
    sNombreUsuario: string,
    sNombreUbicacion: string,
    sUEN: string,
    sTipoEquipo: string,
    sMarca: string,
    sModelo: string,
    sSerie:string,
    sPlaca:string,
    dtFechaAsignacion:Date,
    dtFechaRenovacion:Date,
    UsuarioInven:string,
    dtInventario:Date,
    inventariado:number
}

export class InventoryAsgEmployedFinally{}