import { Guid } from "guid-typescript";

export interface altadispositivos {
    uiRegistroEquipo: Guid,
    uiRemision: Guid;
    uiTipoEquipo: number;
    uiTipoEquipoS: string;
    sTipoEquipo: string;
    uiMarca: number;
    sMarca: string;
    uiModelo: number;
    sModelo: string;
    sSerie: string;
    sPlaca: string;
    uiNumeroEmpleado: number;
    sStatus: string;
    SubStatus: string;
    sRemision:string;
    sTipoRegistro: number;
}

export class altadispositivos {

}
