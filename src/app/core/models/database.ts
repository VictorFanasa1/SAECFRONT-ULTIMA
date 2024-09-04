import Dexie, { Table } from 'dexie';

export interface SeriesAF {
  id?: number;
  sSerie: string;
}

export class AppDB extends Dexie {
  tSeriesAF!: Table<SeriesAF, number>;

  constructor() {
    super('RecursosSAEC');
    this.version(3).stores({
        tSeriesAF: '++id'
    });
  }

//   async populate() {
//     const todoListId = await db.tSeriesAF.add({
//       title: 'To Do Today',
//     });
//     await db.todoItems.bulkAdd([
//       {
//         todoListId,
//         title: 'Feed the birds',
//       },
//       {
//         todoListId,
//         title: 'Watch a movie',
//       },
//       {
//         todoListId,
//         title: 'Have some sleep',
//       },
//     ]);
//   }
}

export const db = new AppDB();