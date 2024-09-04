import { Guid } from "guid-typescript";

export interface assigments {
    uiAssigment: Guid;
    uiEmployed: number;
    sEmployed: string;
    sSerie: string;
    sPlaca: string;
    sType: string;
    sBrand: string;
    sModel: string;
    dtAssigment: Date;
    dtInventory: Date;
    sPlace: string;
    bDocument: string;
    uiDocument: Guid;
    uiPlace: string;
}

export class assigments {

}

// public Guid uiAssigment { get; set; }
// public int uiEmployed { get; set; }
// public string sEmployed { get; set; }
// public string sSerie { get; set; }
// public DateTime dtAssigment { get; set; }
// public DateTime? dtInventory { get; set; }
// public string sPlace { get; set; }