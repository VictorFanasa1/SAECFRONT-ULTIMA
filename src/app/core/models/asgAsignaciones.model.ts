import { Guid } from "guid-typescript";

export interface asgAsignaciones {
    uiAsignacion: Guid;
    uiRegistroEquipo: Guid;
    uiNumeroEmpleado: number;
    uiNumeroResponsable: number;
    uiRegistroTipoAsignacion: number;
    dtFechaAsignacion: Date;
    dtFechaRenovacion: Date;
    dtFechaFin: Date;
    sObservaciones: string;
    sTicket: string;
}

export class asgAsignaciones {
    
}

// public Guid uiAsignacion { get; set; }

// public Guid uiRegistroEquipo { get; set; }
// [Required]
// public int uiNumeroEmpleado { get; set; }
// public int? uiNumeroResponsable { get; set; }
// [Required]
// public int uiRegistroTipoAsignacion { get; set; }

// public DateTime dtFechaAsignacion { get; set; }

// public DateTime? dtFechaRenovacion { get; set; }

// public DateTime? dtFechaFin { get; set; }

// public string sObservaciones { get; set; }
// public string sTicket { get; set; }