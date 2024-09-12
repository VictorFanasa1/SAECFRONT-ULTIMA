import { Guid } from "guid-typescript";

export interface facturas {
  uiFactura: Guid,
  uiComercial: Guid;
  sFactura:string,
  dtFecha: Date,
  uiDetalle: Guid,
  uiRegistro:number,
  uiModelo: number,
  mCostoUnitario: number,
  iCantidad: number,
  mCostoTotal: number
}

export class facturas {

}
