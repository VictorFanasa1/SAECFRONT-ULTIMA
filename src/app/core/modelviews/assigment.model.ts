import { admEmpleados } from "../models/admEmpleados.model";
import { asgExternos } from "../models/asgExternos.modal";
import { catAccesorios } from "../models/catAccesorios.model";
import { activofijo } from "./activofijo.model";
import { newExternal } from "./newExternal.model";
import { support } from "./support.model";

export interface assigment {
    user: admEmpleados;
    bExternal: boolean;
    external:  newExternal;
    ubicacion: string;
    type: number;
    activoFijo: activofijo;
    adicionals: activofijo[];
    support: support;
    accesories: number[];
}

export class assigment {

}