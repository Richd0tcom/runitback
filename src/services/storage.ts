import {
  RequestData,
  ResponseData,
  GetRequestFilter,
} from "../models/requests";

const DB_NAME = "RequestReplayDB";
const DB_VERSION = 1;

class Storage {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);


      request.onupgradeneeded = (event) => {
        const idb = (event.target as IDBOpenDBRequest).result

        if (!idb.objectStoreNames.contains('requests')) {
          const store = idb.createObjectStore('requests', { keyPath: 'id' })
          store.createIndex('url', 'url', { unique: false })
          store.createIndex('method', 'method', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('collectionID', 'collectionID', { unique: false })

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

    if (!request.id) {
      request.id = crypto.randomUUID()
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('requests', 'readwrite')
      const store = tx.objectStore('requests')
      const saveReq = store.put(request)

      saveReq.onsuccess = () => {
        resolve(request.id!)
      }

      saveReq.onerror = (e: Event) => {
        reject((e.target as IDBRequest).error)
      }
    })
  }


  async saveResponse(response: ResponseData): Promise<string> {

    await this.mustDBInit();


    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('responses', 'readwrite')
      const store = tx.objectStore('responses')
      const saveRes = store.put(response)
  
      saveRes.onsuccess = ()=> {
        resolve(response.requestID)
      }

      saveRes.onerror = (e: Event) => {
        reject((e.target as IDBRequest).error)
      }
  
    })

  }



  async getRequests(filter?: GetRequestFilter): Promise<RequestData[]> {
    await this.mustDBInit()

    return new Promise((resolve, reject)=> {

      // const requests: RequestData[] = []
      const tx = this.db!.transaction('requests', 'readonly')
      const store = tx.objectStore('responses')
      const reqs = store.getAll()


      reqs.onsuccess = ()=> {
        let results = reqs.result

        if(filter){

          //NOTE: filters use an AND pattern. if the results of previous filters return an empyt list, 
          // the final result will be empty regardless of if the subsequesnt filters hold true.
          // Is this a problem? Yes, Maybe? the order of filtering does affects the results.
          //TODO: implement an OR pattern maybe using object sets.


          if (filter.url) {
            results = results.filter((req: RequestData)=> req.url.includes(filter.url!))
          }

          if (filter.collectionId) {
            results = results.filter((req: RequestData)=> req.collectionID === filter.collectionId! )
          }
          if(filter.method) {
            results = results.filter((req: RequestData)=> req.method === filter.method)
          }

          if(filter.timeEnd) {
            results = results.filter((req: RequestData)=> req.timestamp <= filter.timeEnd!)
          }

          if(filter.timeStart) {
            results = results.filter((req: RequestData)=> req.timestamp >= filter.timeStart!)
          }
        }

        resolve(results)
      }

      reqs.onerror = (e: Event) => {
        reject((e.target as IDBRequest).error)
      }
    })
  }
}

// const storage = new Storage()

export default new Storage()