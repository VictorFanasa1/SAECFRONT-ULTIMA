import { Guid } from "guid-typescript";

export interface catComercialFacturaDetalle {
  uiDetalle: Guid,
  uiFactura: Guid;
  uiRegistro:number,
  uiModelo: number,
  mCostoUnitario: number,
  iCantidad: number,
  mCostoTotal: number
}

export class catComercialFacturaDetalle {

}
