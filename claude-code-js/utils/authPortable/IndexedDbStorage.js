// class: IndexedDbStorage
class IndexedDbStorage {
  dbName;
  constructor(dbName = "aws:cognito-identity-ids") {
    this.dbName = dbName;
  }
  getItem(key) {
    return this.withObjectStore("readonly", (store) => {
      let req = store.get(key);
      return new Promise((resolve9) => {
        req.onerror = () => resolve9(null), req.onsuccess = () => resolve9(req.result ? req.result.value : null);
      });
    }).catch(() => null);
  }
  removeItem(key) {
    return this.withObjectStore("readwrite", (store) => {
      let req = store.delete(key);
      return new Promise((resolve9, reject) => {
        req.onerror = () => reject(req.error), req.onsuccess = () => resolve9();
      });
    });
  }
  setItem(id, value) {
    return this.withObjectStore("readwrite", (store) => {
      let req = store.put({ id, value });
      return new Promise((resolve9, reject) => {
        req.onerror = () => reject(req.error), req.onsuccess = () => resolve9();
      });
    });
  }
  getDb() {
    let openDbRequest = self.indexedDB.open(this.dbName, 1);
    return new Promise((resolve9, reject) => {
      openDbRequest.onsuccess = () => {
        resolve9(openDbRequest.result);
      }, openDbRequest.onerror = () => {
        reject(openDbRequest.error);
      }, openDbRequest.onblocked = () => {
        reject(Error("Unable to access DB"));
      }, openDbRequest.onupgradeneeded = () => {
        let db = openDbRequest.result;
        db.onerror = () => {
          reject(Error("Failed to create object store"));
        }, db.createObjectStore("IdentityIds", { keyPath: "id" });
      };
    });
  }
  withObjectStore(mode, action) {
    return this.getDb().then((db) => {
      let tx = db.transaction("IdentityIds", mode);
      return tx.oncomplete = () => db.close(), new Promise((resolve9, reject) => {
        tx.onerror = () => reject(tx.error), resolve9(action(tx.objectStore("IdentityIds")));
      }).catch((err) => {
        throw db.close(), err;
      });
    });
  }
}
