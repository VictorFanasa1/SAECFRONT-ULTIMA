import { Guid } from "guid-typescript";

export interface comercial {
    uiComercial: Guid;
    sFolio: string;
    dtUpload: Date;
    dtOC: Date;
    sType: string;
    sUEN: string;
    sProveedor: string;
    sContrato: string;
    sArrendador: string;
    sContratoA: string;
    iVencimiento: number;
    dtStart: Date;
    dtEnd: Date;
    sTypeA: string;
    iPz: string;
}

export class comercial {

}
// public string sArrendador { get; set; }
// public string sContratoA { get; set; }
// public int iVencimiento { get; set; }
// public DateTime dtStart { get; set; }
// public DateTime dtEnd { get; set; }
// public string sTypeA { get; set; }
// public string iPz { get; set; }