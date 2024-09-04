import { Guid } from "guid-typescript";

export interface transferencia {
    uiTransfer: Guid;
    sSerie: string;
    sResponsable: string;
    sUbicacion: string;
    sComment: string;
    bActive: boolean;
    dtCreated: Date;
    dtFinished: Date;
}

export class transferencia {

}

// public Guid uiTransfer { get; set; }
// public string sSerie { get; set; }
// public string sResponsable { get; set; }
// public string sUbicacion { get; set; }
// public bool bActive { get; set; }
// public DateTime dtCreated { get; set; }
// public DateTime? dtFinished { get; set; }