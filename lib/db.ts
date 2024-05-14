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
  bands!: EntityTable<Band, "id", InsertType<Band, "realmId" | "id" | "owner">>;
  songs!: EntityTable<Song, "id", InsertType<Song, "realmId" | "id" | "owner">>;

  constructor() {
    super("setlists", { addons: [dexieCloud] });
    this.version(2).stores({
      bands: "id, name",
      songs: "id, title, bandId, key, description",

      // These dexie-cloud access control tables should not be changed
      realms: "@realmId",
      members: "@id,[realmId+email]",
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
  return db.transaction("rw", [db.bands, db.realms], async () => {
    const bandId = await db.bands.add({
      id: slugify(params.name),
      name: params.name,
    });

    // Creates a new realm for the band
    const realmId = getTiedRealmId(bandId);

    await db.realms.put({
      realmId,
      name: params.name,
      represents: "a band",
    });

    // Put the band into that realm
    await db.bands.update(bandId, { realmId });

    return bandId;
  });
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
  const songId = await db.songs.add({
    id: slugify(params.title),
    title: params.title,
    bandId: params.bandId,
    realmId: band.realmId,
    key: params.key,
    description: params.description,
  });
  return songId;
}

export async function editSong(
  params: Pick<Song, "id" | "title" | "key" | "description">
) {
  const song = await db.songs.get(params.id);
  if (!song) throw new Error("Song not found");
  const band = await db.bands.get(song.bandId);
  if (!band) throw new Error("Band not found");
  await db.songs.update(params.id, {
    title: params.title,
    key: params.key,
    description: params.description,
    realmId: band.realmId,
  });
}

export function inviteBandMember(
  band: Band,
  newMember: { email: string; name: string }
) {
  return db.transaction("rw", [db.bands, db.realms, db.members], async () => {
    // Add or update a realm, tied to the todo-list using getTiedRealmId():
    const realmId = getTiedRealmId(band.id);
    await db.realms.put({
      realmId,
      name: band.name,
      represents: "a band",
    });

    // Move band into the realm (if not already there):
    await db.bands.update(band.id, { realmId });

    await db.members.add({
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
