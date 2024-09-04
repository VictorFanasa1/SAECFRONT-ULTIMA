import { Guid } from "guid-typescript";

export interface preliberado {
    uiAsignacion: Guid;
    uiDispositivo: Guid;
    iEmpleado: number;
    sEmpleado: string;
    sResponsable: string;
    uiUbicacion: string;
    sUbicacion: string;
    sTipo: string;
    sMarca: string;
    sModelo: string;
    sSerie: string;
    sPlaca: string;
    dtPreliberacion: Date;
    iDias: number;
}
