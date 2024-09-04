import { Guid } from "guid-typescript";

export interface catComercial {
    uiComercial: Guid;
    dtFechaAlta: Date;
    sFolioOrdenCompra: string;
    dtFechaOrden: Date;
    uiTipoAdquisicion: number;
    sUEN: string;
}

// public Guid uiComercial { get; set; }
// [Required]
// public DateTime dtFechaAlta { get; set; }
// [Required]
// public string sFolioOrdenCompra { get; set; }
// [Required]
// public DateTime dtFechaOrden { get; set; }
// [Required]
// public int uiTipoAdquisicion { get; set; }
// [Required]
// public string sUEN { get; set; }