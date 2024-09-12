import { Guid } from "guid-typescript";

export interface catComercialArrendadores {
  uiRegistro: number,
  uiComercial: Guid;
  uiProveedor:number,
  sContrato: string,
  iVencimineto: number,
  dtInicio: Date;
  dtFin: Date;
  uiTipoArrendamiento: number;
  sArrendamiento: number;
}


export class catComercialArrendadores {

}