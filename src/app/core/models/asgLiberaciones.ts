import { Guid } from "guid-typescript";

export interface asgLiberaciones
{
    uiLiberacion: Guid,
    uiAsignacion: Guid,
    uiMotivo: number,
    uiEntrega: number,
    uiStatus: number,
    uiSubStatus: number,
    sComentario: string,
    dtFecha: Date
}

export class asgLiberaciones {}