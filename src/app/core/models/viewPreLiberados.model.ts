import { Guid } from "guid-typescript";

export interface viewPreLiberados {
    uiLiberacion: Guid;
    uiAsignacion: Guid;
    iEmpleado: number;
    sEmpleado: string;
    uiResponsable: number;
    sResponsable: string;
    sUbicacion: string;
    sSerie: string;
    sTipo: string;
    sMarca: string;
    sModelo: string;
    dtPreLiberacion: Date;
    iDias: number;
}

// public Guid uiAsignacion { get; set; }
// public int iEmpleado { get; set; }
// public string sEmpleado { get; set; }
// public int uiResponsable { get; set; }
// public string sResponsable { get; set; }
// public string sUbicacion { get; set; }
// public string sSerie { get; set; }
// public string sTipo { get; set; }
// public string sMarca { get; set; }
// public string sModelo { get; set; }
// public DateTime dtPreLiberacion { get; set; }
// public int iDias { get; set; }