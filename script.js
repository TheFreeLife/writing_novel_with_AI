document.addEventListener('DOMContentLoaded', async () => {
    // --- DOM 요소 가져오기 ---
    // 뷰 관련
    const menuView = document.getElementById('menu-view');
    const editorView = document.getElementById('editor-view');
    const projectListUl = document.getElementById('project-list');
    const createProjectBtn = document.getElementById('create-project-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');

    // 에디터 관련
    const chapterList = document.getElementById('chapter-list');
    const editor = document.getElementById('editor');
    const newChapterBtn = document.getElementById('new-chapter-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');

    // 글자 수 카운터
    const countTotalEl = document.getElementById('count-total');
    const countNoSpaceEl = document.getElementById('count-no-space');
    const countPureEl = document.getElementById('count-pure');

    // 설정 패널 관련
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay'); // 설정 패널 및 프로젝트 모달용 공통 오버레이
    const settingsOpenBtn = document.getElementById('settings-open-btn');
    const settingsCloseBtn = document.getElementById('settings-close-btn');
    // 설정 항목 컨트롤
    const bgColorInput = document.getElementById('setting-bg-color');
    const fontColorInput = document.getElementById('setting-font-color');
    const fontSizeRangeInput = document.getElementById('setting-font-size-range');
    const fontSizeNumberInput = document.getElementById('setting-font-size-number');
    const fontFamilySelect = document.getElementById('setting-font-family');

    // 프로젝트 생성 모달 관련
    const createProjectModal = document.getElementById('create-project-modal');
    const newProjectTitleInput = document.getElementById('new-project-title');
    const newProjectDescriptionInput = document.getElementById('new-project-description');
    const newProjectThumbnailInput = document.getElementById('new-project-thumbnail');
    const modalCreateBtn = document.getElementById('modal-create-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    // --- 애플리케이션 상태 ---
    let projects = []; // 프로젝트 목록
    let currentProjectId = null; // 현재 선택된 프로젝트 ID
    let activeChapterIndex = 0; // 현재 선택된 챕터 인덱스
    let novel = []; // 현재 프로젝트의 소설 데이터
    let currentSettings; // 현재 프로젝트의 설정

    // --- IndexedDB 설정 ---
    const DB_NAME = 'NovelEditorDB';
    const DB_VERSION = 2; // 스토어 추가로 버전 업그레이드
    const STORE_SETTINGS = 'settings';
    const STORE_NOVEL = 'novel';
    const STORE_PROJECTS = 'projects'; // 새 프로젝트 스토어
    let db;

    // IndexedDB 열기 및 초기화
    async function openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const tempDb = event.target.result;
                if (!tempDb.objectStoreNames.contains(STORE_SETTINGS)) {
                    tempDb.createObjectStore(STORE_SETTINGS);
                }
                if (!tempDb.objectStoreNames.contains(STORE_NOVEL)) {
                    tempDb.createObjectStore(STORE_NOVEL);
                }
                if (!tempDb.objectStoreNames.contains(STORE_PROJECTS)) {
                    tempDb.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.errorCode);
                reject("IndexedDB error");
            };
        });
    }

    // IndexedDB에서 데이터 가져오기 (key는 projectId)
    async function getFromStore(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!db) { reject("DB not open"); return; }
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.errorCode);
        });
    }

    // IndexedDB에 데이터 저장하기
    async function setToStore(storeName, key, value) {
        return new Promise((resolve, reject) => {
            if (!db) { reject("DB not open"); return; }
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            let request;
            if (store.keyPath) { // keyPath가 정의된 스토어는 value에서 키를 추출
                request = store.put(value); // key 인자 생략
            } else { // keyPath가 없는 스토어는 key 인자를 명시적으로 전달
                request = store.put(value, key);
            }

            request.onsuccess = () => resolve();
            request.onerror = (event) => {
                console.error(`Error saving to store ${storeName} with key ${key}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    // IndexedDB에서 모든 프로젝트 가져오기
    async function getAllProjects() {
        return new Promise((resolve, reject) => {
            if (!db) { reject("DB not open"); return; }
            const transaction = db.transaction([STORE_PROJECTS], 'readonly');
            const store = transaction.objectStore(STORE_PROJECTS);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.errorCode);
        });
    }

    // --- 지속적인 저장소 권한 요청 ---
    async function requestPersistentStorage() {
        if (navigator.storage && navigator.storage.persist) {
            const isPersisted = await navigator.storage.persisted();
            if (isPersisted) {
                console.log("Storage is already persistent.");
                return true;
            }
            const granted = await navigator.storage.persist();
            if (granted) {
                console.log("Persistent storage granted.");
                return true;
            } else {
                console.warn("Persistent storage not granted. Data might be cleared by browser under certain conditions.");
                alert("브라우저가 자동으로 데이터를 삭제하지 않도록 '지속적인 저장소' 권한을 요청합니다. 권한 부여가 필요할 수 있습니다.");
            }
        } else {
            console.warn("StorageManager API not supported. Cannot request persistent storage.");
        }
        return false;
    }

    // --- 설정 관련 로직 ---
    const defaultSettings = {
        bgColor: '#ffffff',
        fontColor: '#212529',
        fontSize: '16',
        fontFamily: "'Noto Serif CJK KR', serif"
    };

    async function loadSettings(projectId) {
        const saved = await getFromStore(STORE_SETTINGS, projectId);
        currentSettings = saved ? { ...defaultSettings, ...saved } : defaultSettings;
        applySettings(currentSettings);
        return currentSettings;
    }

    async function applySettings(settings) {
        document.documentElement.style.setProperty('--editor-bg-color', settings.bgColor);
        document.documentElement.style.setProperty('--editor-font-color', settings.fontColor);
        document.documentElement.style.setProperty('--editor-font-size', `${settings.fontSize}px`);
        document.documentElement.style.setProperty('--editor-font-family', settings.fontFamily);

        bgColorInput.value = settings.bgColor;
        fontColorInput.value = settings.fontColor;
        fontSizeRangeInput.value = settings.fontSize;
        fontSizeNumberInput.value = settings.fontSize;
        fontFamilySelect.value = settings.fontFamily;
    }

    async function saveSettings(settings) {
        if (!currentProjectId) { console.warn("No project selected to save settings."); return; }
        await setToStore(STORE_SETTINGS, currentProjectId, settings);
        console.log("Settings saved!");
    }

    function openSettings() {
        settingsPanel.classList.add('open');
        overlay.classList.add('visible');
        settingsOpenBtn.style.opacity = '0';
        settingsOpenBtn.style.pointerEvents = 'none';
    }

    function closeSettings() {
        settingsPanel.classList.remove('open');
        overlay.classList.remove('visible');
        settingsOpenBtn.style.opacity = '1';
        settingsOpenBtn.style.pointerEvents = 'auto';
    }

    // --- 글자 수 계산 함수 ---
    function updateCharCount() {
        const text = editor.value;
        const totalLength = text.length;
        const noSpaceLength = text.replace(/\s/g, '').length;
        const pureChars = text.match(/[가-힣a-zA-Z0-9]/g) || [];
        const pureLength = pureChars.length;

        countTotalEl.textContent = totalLength.toLocaleString();
        countNoSpaceEl.textContent = noSpaceLength.toLocaleString();
        countPureEl.textContent = pureLength.toLocaleString();
    }

    // --- 소설 데이터 관리 함수 ---
    async function loadNovel(projectId) {
        const savedNovel = await getFromStore(STORE_NOVEL, projectId);
        novel = (savedNovel && savedNovel.length > 0) ? savedNovel : [{ title: '첫 번째 챕터', content: '' }];
        activeChapterIndex = 0;
        render();
    }

    async function saveNovel() {
        if (!currentProjectId) { console.warn("No project selected to save novel."); return; }
        if (novel.length > 0) {
            await setToStore(STORE_NOVEL, currentProjectId, novel);
        }
    }

    function render() {
        chapterList.innerHTML = '';
        novel.forEach((chapter, index) => {
            const li = document.createElement('li');
            li.textContent = chapter.title;
            li.dataset.index = index;
            if (index === activeChapterIndex) {
                li.classList.add('active');
            }
            chapterList.appendChild(li);
        });

        editor.value = novel[activeChapterIndex]?.content || '';
        updateCharCount();
    }

    async function addChapter(title) {
        const newChapter = { title: title || `챕터 ${novel.length + 1}`, content: '' };
        novel.push(newChapter);
        activeChapterIndex = novel.length - 1;
        await saveNovel();
        render();
    }

    async function switchChapter(index) {
        if (index === activeChapterIndex) return;
        await saveNovel();
        activeChapterIndex = index;
        render();
    }

    // --- 뷰 관리 ---
    function showView(viewId) {
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            if (view.id === viewId) {
                view.classList.remove('hidden');
                view.style.zIndex = '10'; // 활성화된 뷰를 위로
            } else {
                view.classList.add('hidden');
                view.style.zIndex = '1';
            }
        });

        // 에디터 뷰일 때만 설정 버튼 보이게
        if (viewId === 'editor-view') {
            settingsOpenBtn.style.display = 'block';
        } else {
            settingsOpenBtn.style.display = 'none';
        }
    }

    // --- 프로젝트 관리 ---
    async function renderProjectList() {
        projects = await getAllProjects();
        projectListUl.innerHTML = '';
        if (projects.length === 0) {
            projectListUl.innerHTML = '<li class="no-projects">프로젝트가 없습니다. 새로 생성해주세요.</li>';
            return;
        }
        projects.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate)); // 최신순 정렬
        projects.forEach(project => {
            const li = document.createElement('li');
            li.dataset.projectId = project.id;

            // 썸네일 경로가 없으면 검은색 배경 표시
            let thumbHTML = '';
            if (project.thumbnail) {
                thumbHTML = `<img src="${project.thumbnail}" class="project-thumb" alt="thumbnail">`;
            } else {
                thumbHTML = `<div class="project-thumb no-thumb"></div>`;
            }

            li.innerHTML = `
                ${thumbHTML}
                <div class="project-info">
                    <span class="project-title">${project.name}</span>
                    <span class="project-description">${project.description || '설명 없음'}</span>
                    <span class="project-date">${new Date(project.creationDate).toLocaleDateString()}</span>
                </div>
            `;
            li.addEventListener('click', () => selectProject(project.id));
            projectListUl.appendChild(li);
        });
    }

    // 프로젝트 생성 모달 열기
    function openCreateProjectModal() {
        newProjectTitleInput.value = '';
        newProjectDescriptionInput.value = '';
        newProjectThumbnailInput.value = ''; // file input value 리셋

        createProjectModal.style.display = 'flex';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                createProjectModal.classList.add('visible');
                overlay.classList.add('visible');
            });
        });
    }

    // 프로젝트 생성 모달 닫기
    function closeCreateProjectModal() {
        createProjectModal.classList.remove('visible');
        overlay.classList.remove('visible');
        setTimeout(() => {
            if (!createProjectModal.classList.contains('visible')) {
                createProjectModal.style.display = 'none';
            }
        }, 300);
    }

    async function handleCreateProject() {
        const title = newProjectTitleInput.value.trim();
        const description = newProjectDescriptionInput.value.trim();
        const thumbnailFile = newProjectThumbnailInput.files[0];

        if (!title) {
            alert("소설 제목은 필수입니다.");
            return;
        }

        let thumbnailData = null;

        // 파일이 선택된 경우 Base64로 변환
        if (thumbnailFile) {
            thumbnailData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(thumbnailFile);
            });
        }

        const projectId = Date.now().toString();
        const newProject = {
            id: projectId,
            name: title,
            description: description,
            thumbnail: thumbnailData,
            creationDate: new Date().toISOString()
        };

        try {
            await setToStore(STORE_PROJECTS, null, newProject);
            await setToStore(STORE_NOVEL, projectId, [{ title: '첫 번째 챕터', content: '' }]);
            await setToStore(STORE_SETTINGS, projectId, defaultSettings);

            currentProjectId = projectId;
            await loadSettings(currentProjectId);
            await loadNovel(currentProjectId);
            showView('editor-view');
            await renderProjectList();
            closeCreateProjectModal();
        } catch (error) {
            console.error("Project creation failed:", error);
            alert("프로젝트 생성 중 오류가 발생했습니다.");
        }
    }


    async function selectProject(projectId) {
        currentProjectId = projectId;
        await loadSettings(currentProjectId);
        await loadNovel(currentProjectId);
        showView('editor-view');
    }

    // --- 이벤트 리스너 등록 (초기화 전에 등록하여 UI 반응성 확보) ---
    settingsOpenBtn.addEventListener('click', openSettings);
    settingsCloseBtn.addEventListener('click', closeSettings);

    // 오버레이 클릭 시 설정창 또는 프로젝트 모달 닫기
    overlay.addEventListener('click', () => {
        if (settingsPanel.classList.contains('open')) {
            closeSettings();
        }
        if (createProjectModal.classList.contains('visible')) {
            closeCreateProjectModal();
        }
    });

    bgColorInput.addEventListener('input', () => {
        currentSettings.bgColor = bgColorInput.value;
        applySettings(currentSettings);
    });
    fontColorInput.addEventListener('input', () => {
        currentSettings.fontColor = fontColorInput.value;
        applySettings(currentSettings);
    });
    fontSizeRangeInput.addEventListener('input', () => {
        currentSettings.fontSize = fontSizeRangeInput.value;
        applySettings(currentSettings);
    });
    fontSizeNumberInput.addEventListener('change', () => {
        let value = fontSizeNumberInput.value.trim();
        const min = parseInt(fontSizeNumberInput.min, 10);
        const max = parseInt(fontSizeNumberInput.max, 10);
        if (!/^-?\d+$/.test(value)) {
            fontSizeNumberInput.value = currentSettings.fontSize;
            return;
        }
        let parsedValue = parseInt(value, 10);
        parsedValue = Math.max(min, Math.min(max, parsedValue));
        if (parsedValue.toString() !== currentSettings.fontSize) {
            currentSettings.fontSize = parsedValue.toString();
            applySettings(currentSettings);
        } else {
            fontSizeNumberInput.value = parsedValue.toString();
        }
    });
    fontFamilySelect.addEventListener('change', () => {
        currentSettings.fontFamily = fontFamilySelect.value;
        applySettings(currentSettings);
    });

    saveSettingsBtn.addEventListener('click', async () => {
        await saveSettings(currentSettings);
        alert('설정이 저장되었습니다!');
        closeSettings();
    });

    newChapterBtn.addEventListener('click', async () => {
        const title = prompt('새 챕터의 이름을 입력하세요:', `챕터 ${novel.length + 1}`);
        if (title) {
            await addChapter(title);
        }
    });

    chapterList.addEventListener('click', async (e) => {
        const li = e.target.closest('li[data-index]');
        if (li) {
            await switchChapter(parseInt(li.dataset.index, 10));
        }
    });

    editor.addEventListener('input', async () => {
        await saveNovel();
        updateCharCount();
    });

    modalCreateBtn.addEventListener('click', handleCreateProject);
    modalCancelBtn.addEventListener('click', closeCreateProjectModal);
    createProjectBtn.addEventListener('click', openCreateProjectModal);

    backToMenuBtn.addEventListener('click', async () => {
        await saveNovel(); // 나가기 전에 저장
        currentProjectId = null;
        await renderProjectList();
        showView('menu-view');
    });


    projectListUl.addEventListener('click', async (e) => {
        const li = e.target.closest('li[data-project-id]');
        if (li && li.dataset.projectId) {
            await selectProject(li.dataset.projectId);
        }
    });

    // --- 초기화 실행 ---
    try {
        await openIndexedDB();
        await requestPersistentStorage();
        await renderProjectList();
        showView('menu-view');
    } catch (error) {
        console.error("Initialization failed:", error);
        alert("데이터베이스 초기화에 실패했습니다. 페이지를 새로고침하거나 브라우저 설정을 확인해주세요.");
    }
});
