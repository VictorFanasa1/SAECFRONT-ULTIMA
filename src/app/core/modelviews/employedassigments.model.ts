import { Guid } from "guid-typescript";

export interface employedassigments {
    uiEmployed: number;
    sEmployed: string;
    assigments: employedassigment[];
}

export class employedassigments {

}

export interface employedassigment {
    uiAsiggment: Guid;
    sType: string;
    sBranch: string;
    sModel: string;
    sSerie: string;
}
