import { Guid } from "guid-typescript";
import { asgExternos } from "../models/asgExternos.modal";

export interface asighistory {
    uiAsiggment: Guid;
    uiReleased: Guid;
    sSerie: string;
    sTypeDevice: string;
    sType: string;
    uiEmployed: number;
    sEmployed: string;
    sPlace: string;
    dtAsigment: Date;
    dtInventory: Date;
    dtPreReleased: Date;
    dtReleased: Date;
    sStatus: string;
    sSubStatus: string;
    bResponsiva: boolean;
    bReleased: boolean;
    objExternal: asgExternos;
    lAccesories: string[];
    lAdicionals: asghisotryadi[];
}

export class asighistory {
    
}

export interface asghisotryadi {
    sType: string;
    sBranch: string;
    sModel: string;
    sSerie: string;
    sPlaca: string;
    dtAsiggment: Date;
    dtReleased: Date;
}

// public class asighistory
// {
//     public Guid uiAsiggment { get; set; }
//     public Guid? uiReleased { get; set; }
//     public int uiEmployed { get; set; }
//     public string sEmployed { get; set; }
//     public string sPlace { get; set; }
//     public DateTime dtAsigment { get; set; }
//     public DateTime? dtInventory { get; set; }
//     public DateTime? dtPreReleased { get; set; }
//     public DateTime? dtReleased { get; set; }
//     public string sStatus { get; set; }
//     public string sSubStatus { get; set; }
//     public bool bResponsiva { get; set; }
//     public bool bReleased { get; set; }
//     public asgExternos? objExternal { get; set; }
//     public List<string> lAccesories { get; set; }
//     public List<asghisotryadi> lAdicionals { get; set; }
// }

// public class asghisotryadi
// {
//     public string sType { get; set; }
//     public string sBranch { get; set; }
//     public string sModel { get; set; }
//     public DateTime dtAsiggment { get; set; }
//     public DateTime? dtReleased { get; set; }
// }