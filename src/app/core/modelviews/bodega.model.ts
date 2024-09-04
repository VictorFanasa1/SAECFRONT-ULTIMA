import { Guid } from "guid-typescript";

export interface bodega {
    uiEquipo: Guid;
    uiUbicacion: string;
    sTipo: string;
    sMarca: string;
    sModelo: string;
    sSerie: string;
    sPlaca: string;
    uiStatus: number;
    sSubStatus: string;
    sContrato: string;
    dtMovimiento: Date;
    dtInicio: Date;
    dtFin: Date;
    iDias: number;
}

export class bodega {

}