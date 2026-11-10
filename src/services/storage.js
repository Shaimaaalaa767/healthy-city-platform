const DB_NAME = 'healthy-city-evidence'
const STORE = 'evidence'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('المتصفح لا يدعم التخزين المحلي للملفات'))
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getEvidence() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result.sort((a, b) => b.createdAt - a.createdAt))
    req.onerror = () => reject(req.error)
  })
}

export async function saveEvidence(item) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(item)
    tx.oncomplete = () => resolve(item)
    tx.onerror = () => reject(tx.error)
  })
}

export async function deleteEvidence(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}