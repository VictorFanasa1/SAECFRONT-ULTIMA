import { Guid } from "guid-typescript";

export interface factura {
    uiComercial: Guid;
    sFactura: string;
    iPiezas: number;
    dPrecio: number;
    dtCreated: Date;
    bFile: boolean;
}

export class factura {

}
