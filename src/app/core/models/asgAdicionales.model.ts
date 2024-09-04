import { Guid } from "guid-typescript";

export interface asgAdicionales {
    uiAdicional: number;
    uiAsignacion: Guid;
    uiRegistroEquipo: Guid;
    dtFechaAsignacion: Date;
    dtFechaLiberacion: Date;
}

// public int uiAdicional { get; set; }
// public Guid uiAsignacion { get; set; }
// public Guid uiRegistroEquipo { get; set; }
// public DateTime dtFechaAsignacion { get; set; }
// public DateTime? dtFechaLiberacion { get; set; }