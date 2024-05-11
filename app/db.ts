import Dexie, { Table } from "dexie";

export interface Song {
  name: string;
}

export class SetlistsDexieDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  songs!: Table<Song>;

  constructor() {
    super("setlists");
    this.version(1).stores({
      songs: "name",
    });
  }
}

export const db = new SetlistsDexieDB();
