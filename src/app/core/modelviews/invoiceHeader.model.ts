import { Guid } from "guid-typescript";

export interface invoiceHeader {
    uiFactura: Guid;
    sFactura: string;
    sContrato: string;
    sOC: string;
    iPiezas: number;
    mTotal: number;
    dtFactura: Date;
    bDocument: string;
}