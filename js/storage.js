/**
 * js/storage.js
 * IndexedDB를 사용한 영구 데이터 관리 모듈
 */

export class StorageManager {
    static DB_NAME = 'NovelEditorDB';
    static DB_VERSION = 3; // 버전을 3으로 상향하여 onupgradeneeded 강제 실행
    static STORE_PROJECTS = 'projects';
    static STORE_SETTINGS = 'settings'; 
    static STORE_PROMPTS = 'prompts';   

    static db = null;

    /**
     * DB 초기화 및 영구 저장 권한 요청
     */
    static async init() {
        if (this.db) return;

        // 1. 브라우저에게 영구 저장 권한 요청 (Storage Manager API)
        await this.ensurePersistence();

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // 프로젝트 스토어
                if (!db.objectStoreNames.contains(this.STORE_PROJECTS)) {
                    db.createObjectStore(this.STORE_PROJECTS, { keyPath: 'id' });
                }
                
                // 설정 스토어 (에디터 스타일 등)
                if (!db.objectStoreNames.contains(this.STORE_SETTINGS)) {
                    db.createObjectStore(this.STORE_SETTINGS);
                }

                // 프롬프트 스토어
                if (!db.objectStoreNames.contains(this.STORE_PROMPTS)) {
                    db.createObjectStore(this.STORE_PROMPTS);
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error('IndexedDB 로드 실패:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * 브라우저의 자동 삭제를 방지하기 위한 권한 요청
     */
    static async ensurePersistence() {
        if (navigator.storage && navigator.storage.persist) {
            const isPersisted = await navigator.storage.persisted();
            console.log(`기존 영구 저장 권한 상태: ${isPersisted ? '허용됨' : '허용 안됨'}`);
            
            if (!isPersisted) {
                const granted = await navigator.storage.persist();
                console.log(`영구 저장 권한 요청 결과: ${granted ? '성공' : '실패'}`);
                if (!granted) {
                    console.warn('브라우저가 영구 저장 권한을 거부했습니다. 저장 공간이 부족할 경우 데이터가 삭제될 위험이 있습니다.');
                }
            }
        }
    }

    /**
     * 공통 데이터 저장 (ID 기반 또는 키 기반)
     */
    static async set(storeName, value, key = null) {
        await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = key ? store.put(value, key) : store.put(value);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 데이터 가져오기
     */
    static async get(storeName, key) {
        await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 모든 데이터 가져오기 (주로 프로젝트 목록용)
     */
    static async getAll(storeName) {
        await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 데이터 삭제
     */
    static async delete(storeName, key) {
        await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 프로젝트 전용 삭제 (설정도 함께 삭제 권장)
     */
    static async deleteProject(id) {
        await this.delete(this.STORE_PROJECTS, id);
        await this.delete(this.STORE_SETTINGS, id);
    }

    /**
     * 모든 데이터 내보내기 (JSON 형식)
     */
    static async exportAllData() {
        await this.init();
        const data = {
            version: this.DB_VERSION,
            timestamp: new Date().toISOString(),
            projects: await this.getAll(this.STORE_PROJECTS),
            settings: {},
            prompts: {}
        };

        // Settings 스토어의 모든 키-값 가져오기
        const settingsKeys = await this.getAllKeys(this.STORE_SETTINGS);
        for (const key of settingsKeys) {
            data.settings[key] = await this.get(this.STORE_SETTINGS, key);
        }

        // Prompts 스토어의 모든 키-값 가져오기
        const promptKeys = await this.getAllKeys(this.STORE_PROMPTS);
        for (const key of promptKeys) {
            data.prompts[key] = await this.get(this.STORE_PROMPTS, key);
        }

        return data;
    }

    /**
     * 모든 데이터 가져오기 (기존 데이터 덮어쓰기)
     */
    static async importAllData(data) {
        await this.init();
        
        // 1. 기존 프로젝트 모두 삭제
        const oldProjects = await this.getAll(this.STORE_PROJECTS);
        for (const p of oldProjects) {
            await this.delete(this.STORE_PROJECTS, p.id);
        }

        // 2. 프로젝트 데이터 복원
        if (data.projects) {
            for (const p of data.projects) {
                await this.set(this.STORE_PROJECTS, p);
            }
        }

        // 3. 설정 데이터 복원
        if (data.settings) {
            for (const key in data.settings) {
                await this.set(this.STORE_SETTINGS, data.settings[key], key);
            }
        }

        // 4. 프롬프트 데이터 복원
        if (data.prompts) {
            for (const key in data.prompts) {
                await this.set(this.STORE_PROMPTS, data.prompts[key], key);
            }
        }
    }

    /**
     * 스토어의 모든 키 가져오기 (헬퍼)
     */
    static async getAllKeys(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.getAllKeys();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}