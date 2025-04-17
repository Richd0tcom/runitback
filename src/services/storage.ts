import {
  RequestData,
  RequestCollection,
  RequestHeaders,
  ResponseData,
} from "../models/requests";

const DB_NAME = "RequestReplayDB";
const DB_VERSION = 1;

class Storage {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

        if(!this.db?.objectStoreNames.contains('requests'))

        request.onupgradeneeded = (event) => {
            const idb = (event.target as IDBOpenDBRequest).result

            if(!idb.objectStoreNames.contains('requests')) {
                const store = idb.createObjectStore('requests', { keyPath: 'id'})
                store.createIndex('url', 'url', { unique:  false})
                store.createIndex('method', 'method', { unique:  false})
                store.createIndex('timestamp', 'timestamp', { unique:  false})
                store.createIndex('collectionID', 'collectionID', { unique:  false})

            }

            if (!idb.objectStoreNames.contains('responses')) {
                const store = idb.createObjectStore('responses', { keyPath: 'requestID' });
                store.createIndex('status', 'status', { unique: false });
              }
              
              if (!idb.objectStoreNames.contains('collections')) {
                const store = idb.createObjectStore('collections', { keyPath: 'id' });
                store.createIndex('name', 'name', { unique: false });
                store.createIndex('updatedAt', 'updatedAt', { unique: false });
              }
        }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async mustDBInit(): Promise<IDBDatabase> {
    if (!this.db) {
        await this.initDB()
    }
    return this.db!
  }

  async saveRequest(request: RequestData): Promise<string> {
    await this.mustDBInit()

    if(!request.id) {
        request.id = crypto.randomUUID()
    }

    return new Promise((resolve, reject) => {
        const tx = this.db!.transaction('requests', 'readwrite')
        const store = tx.objectStore('')
    })
  }
}

export default Storage