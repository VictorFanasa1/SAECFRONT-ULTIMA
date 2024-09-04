import Dexie, { Table } from 'dexie';
import { admEmpleados } from '../models/admEmpleados.model';
import { assigments } from '../modelviews/assigments.model';
import { seriesaf } from '../modelviews/seriesaf.model';

export class saec extends Dexie {
  series!: Table<seriesaf>;
  employedsupdate!: Table<admEmpleados>
  asignaciones!: Table<assigments>

  constructor() {
    super('DbSAEC');
    this.version(403).stores({
        series: '++id,sSerie',
        employedsupdate: '++id,uiNumeroEmpleado',
        asignaciones: '++id'
    });
  }
}

export const db = new saec();