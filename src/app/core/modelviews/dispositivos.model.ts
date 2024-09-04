import { Guid } from "guid-typescript";

export interface dispositivos {
    uiDispositivo: Guid;
    sTipo: string;
    bActivoFijo: boolean;
    sMarca: string;
    sModelo: string;
    sSerie: string;
    sPlaca: string;
    sEstatus: string;
    sSubEstatus: string;
    uiRemision: Guid;
    sRemision: string;
    uiUbicacion: string;
    sResponsable: string;
    bTransfer: boolean;
}

export class dispositivos {

}

// public Guid uiDispositivo { get; set; }
// public string sTipo { get; set; }
// public string sMarca { get; set; }
// public string sModelo { get; set; }
// public string sSerie { get; set; }
// public string sPlaca { get; set; }
// public string sEstatus { get; set; }
// public string sSubEstatus { get; set; }
// public Guid uiRemision { get; set; }
// public string sRemision { get; set; }
// public string uiUbicacion { get; set; }
// public string sResponsable { get; set; }
