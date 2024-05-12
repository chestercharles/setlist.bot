import Dexie, { EntityTable, InsertType } from "dexie";
import dexieCloud, { DBRealmMember, getTiedRealmId } from "dexie-cloud-addon";

export interface Band {
  id: string;
  realmId: string;
  owner: string;
  name: string;
}

export interface Song {
  id: string;
  realmId: string;
  owner: string;
  title: string;
  bandId: string;
  key?: string;
  description?: string;
}

export interface Member extends DBRealmMember {
  bandId?: string;
}

class SetlistsDexieDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  bands!: EntityTable<Band, "id", InsertType<Band, "realmId" | "id" | "owner">>;
  songs!: EntityTable<Song, "id", InsertType<Song, "realmId" | "id" | "owner">>;

  constructor() {
    super("setlists", { addons: [dexieCloud] });
    this.version(2).stores({
      bands: "id, name",
      songs: "id, title, bandId, key, description",

      // dexie-cloud access control tables
      realms: "@realmId",
      members: "@id,[realmId+email],bandId",
      roles: "[realmId+name]",
    });
  }
}

const db = new SetlistsDexieDB();

db.cloud.configure({
  databaseUrl: "https://ze74zqeke.dexie.cloud",
  requireAuth: true,
  customLoginGui: true,
});

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

export async function createBand(params: { name: string }) {
  const id = await db.bands.add({
    id: slugify(params.name),
    name: params.name,
  });
  return id;
}

export function deleteBand(band: Band) {
  return db.transaction(
    "rw",
    [db.bands, db.songs, db.realms, db.members],
    async () => {
      await db.songs.where({ bandId: band.id }).delete();
      await db.bands.delete(band.id);
      await db.realms.delete(getTiedRealmId(band.id)); // members are auto-deleted with realm
    }
  );
}

export function deleteSong(id: string) {
  return db.songs.where({ id }).delete();
}

export async function addSong(params: {
  title: string;
  bandId: string;
  key: string;
  description: string;
}) {
  const band = await db.bands.get(params.bandId);
  if (!band) throw new Error("Band not found");
  await db.songs.add({
    id: slugify(params.title),
    title: params.title,
    bandId: params.bandId,
    realmId: band.realmId,
    key: params.key,
    description: params.description,
  });
}

export async function editSong(
  params: Pick<Song, "id" | "title" | "key" | "description">
) {
  await db.songs.update(params.id, {
    title: params.title,
    key: params.key,
    description: params.description,
  });
}

export function inviteBandMember(
  band: Band,
  newMember: { email: string; name: string }
) {
  return db.transaction("rw", [db.bands, db.realms, db.members], () => {
    // Add or update a realm, tied to the todo-list using getTiedRealmId():
    const realmId = getTiedRealmId(band.id);
    db.realms.put({
      realmId,
      name: band.name,
      represents: "a band",
    });

    // Move todo-list into the realm (if not already there):
    db.bands.update(band.id, { realmId });

    db.members.add({
      realmId,
      email: newMember.email,
      name: newMember.name,
      invite: true, // Generates invite email on server on sync
      permissions: {
        manage: "*", // Give your friend full permissions within this new realm.
      },
    });
  });
}

export { db };
