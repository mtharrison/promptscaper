"use client";
import { SavedWorkspace } from "../types";

const VERSION_NUMBER = 1;

export function getDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let db;

    const DBOpenRequest = window.indexedDB.open("promptscaper", VERSION_NUMBER);

    DBOpenRequest.addEventListener("error", (err) => reject(err));

    DBOpenRequest.addEventListener("success", () => {
      db = DBOpenRequest.result;
      resolve(db);
    });

    DBOpenRequest.addEventListener(
      "upgradeneeded",
      (init: IDBVersionChangeEvent) => {
        //@ts-ignore
        db = init.target.result;

        // Create an objectStore for this database
        const objectStore = db.createObjectStore(
          `workspaces_${VERSION_NUMBER}`,
          {
            keyPath: "id",
          }
        );

        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("ts", "ts", { unique: false });
        objectStore.createIndex("state", "state", { unique: false });
      }
    );
  });
}

export async function loadAll(): Promise<SavedWorkspace[]> {
  return new Promise(async (resolve, reject) => {
    const db: IDBDatabase = await getDb();
    const objectStore = db
      .transaction(`workspaces_${VERSION_NUMBER}`)
      .objectStore(`workspaces_${VERSION_NUMBER}`);
    const all = objectStore.getAll();
    //@ts-ignore
    all.onsuccess = (e) => resolve(e.target.result);
    all.onerror = (e) => reject(e);
  });
}

export async function save(item: SavedWorkspace): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db: IDBDatabase = await getDb();
    const objectStore = db
      .transaction(`workspaces_${VERSION_NUMBER}`, "readwrite")
      .objectStore(`workspaces_${VERSION_NUMBER}`);
    const add = objectStore.put(item);
    //@ts-ignore
    add.onsuccess = (e) => resolve();
    add.onerror = (e) => reject(e);
  });
}

export async function load(id: string): Promise<SavedWorkspace> {
  return new Promise(async (resolve, reject) => {
    const db: IDBDatabase = await getDb();
    const objectStore = db
      .transaction(`workspaces_${VERSION_NUMBER}`, "readwrite")
      .objectStore(`workspaces_${VERSION_NUMBER}`);
    const get = objectStore.get(id);
    get.onsuccess = (e) => resolve(get.result);
    get.onerror = (e) => reject(e);
  });
}

export async function remove(id: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db: IDBDatabase = await getDb();
    const objectStore = db
      .transaction(`workspaces_${VERSION_NUMBER}`, "readwrite")
      .objectStore(`workspaces_${VERSION_NUMBER}`);
    const remove = objectStore.delete(id);
    remove.onsuccess = (e) => resolve();
    remove.onerror = (e) => reject(e);
  });
}
