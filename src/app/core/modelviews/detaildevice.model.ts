import { Guid } from "guid-typescript";
import { external } from "../modelviews/external.model";

export interface detaildevice {
    uiDevice: Guid;
    uiRemision: Guid;
    uiAsiggment: Guid;
    sSerie: string;
    sPlaca: string;
    sType: string;
    sBranch: string;
    sModel: string;
    sStatus: string;
    sUEN: string;
    sUser: string;
    sPlace: string;
    bDocument: string;
    objExternal: external;
}

export class detaildevice {
    
}