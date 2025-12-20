/**
 * js/storage.js
 * 데이터베이스 및 로컬 스토리지 관리 모듈
 */

export class StorageManager {
    static DB_NAME = 'NovelEditorDB';
    static DB_VERSION = 2;
    static STORE_SETTINGS = 'settings';
    static STORE_NOVEL = 'novel';
    static STORE_PROJECTS = 'projects';
    static db = null;

    static async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.STORE_SETTINGS)) db.createObjectStore(this.STORE_SETTINGS);
                if (!db.objectStoreNames.contains(this.STORE_NOVEL)) db.createObjectStore(this.STORE_NOVEL);
                if (!db.objectStoreNames.contains(this.STORE_PROJECTS)) db.createObjectStore(this.STORE_PROJECTS, { keyPath: 'id' });
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve();
            };
            request.onerror = () => reject("IndexedDB Initialization Failed");
        });
    }

    static async get(storeName, key) {
        if (!this.db) return null;
        return new Promise((resolve) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        });
    }

    static async set(storeName, value, key = null) {
        if (!this.db) return;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.keyPath ? store.put(value) : store.put(value, key);
            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    }

    static async getAll(storeName) {
        if (!this.db) return [];
        return new Promise((resolve) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve([]);
        });
    }

    static async deleteProject(projectId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.STORE_PROJECTS, this.STORE_NOVEL, this.STORE_SETTINGS], 'readwrite');
            transaction.objectStore(this.STORE_PROJECTS).delete(projectId);
            transaction.objectStore(this.STORE_NOVEL).delete(projectId);
            transaction.objectStore(this.STORE_SETTINGS).delete(projectId);
            transaction.oncomplete = () => resolve();
            transaction.onerror = (e) => reject(e.target.error);
        });
    }
}
