import { Guid } from "guid-typescript";

export interface remision {
    uiFactura: Guid;
    sRemision: string;
    sType: string;
    sModel: string;
    dtCreated: Date;
    sOwner: string;
    sPlace: string;
    bFile: boolean;
}

export class remision {

}

// public Guid uiFactura { get; set; }
// public string sRemision { get; set; }
// public string sType { get; set; }
// public string sModel { get; set; }
// public DateTime dtCreated { get; set; }
// public string sOwner { get; set; }
// public string sPlace { get; set; }
// public bool bFile { get; set; }