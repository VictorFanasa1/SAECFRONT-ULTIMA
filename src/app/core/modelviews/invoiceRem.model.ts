import { Guid } from "guid-typescript";

export interface invoiceRem {
    sFolio: string;
    uiRemision: Guid;
    sDispositivo: string;
    sModelo: string;
    sCantidad: number;
    sEmpleado: string;
    uiEmpleado: number;
    sUbicacion: string;
}

export class invoiceRem {

}