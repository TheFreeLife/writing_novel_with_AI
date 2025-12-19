document.addEventListener('DOMContentLoaded', async () => {
    // --- DOM 요소 가져오기 ---
    // 뷰 관련
    const menuView = document.getElementById('menu-view');
    const projectDetailView = document.getElementById('project-detail-view'); // 추가
    const projectListUl = document.getElementById('project-list');
    const createProjectBtn = document.getElementById('create-project-btn');
    const backToMenuFromDetail = document.getElementById('back-to-menu-from-detail'); // 추가

    // 상세 뷰 요소
    const detailTitle = document.getElementById('detail-project-title');
    const detailDescription = document.getElementById('detail-project-description');
    const detailThumbnail = document.getElementById('detail-project-thumbnail');
    const detailTagsContainer = document.getElementById('detail-project-tags');
    const addTagBtn = document.getElementById('add-tag-btn');

    // --- 프로젝트 세부 설정 요소 ---
    const projSettingEmotion = document.getElementById('proj-setting-emotion');
    const projSettingGratification = document.getElementById('proj-setting-gratification');
    const projSettingFocus = document.getElementById('proj-setting-focus');
    const projSettingPov = document.getElementById('proj-setting-pov');
    const projSettingTone = document.getElementById('proj-setting-tone');
    const projSettingRules = document.getElementById('proj-setting-rules');
    const saveProjSettingsBtn = document.getElementById('save-proj-settings-btn');

    // --- 배경 지식 설정 요소 ---
    const projBgWorld = document.getElementById('proj-bg-world');
    const projBgEvents = document.getElementById('proj-bg-events');
    const saveProjBgBtn = document.getElementById('save-proj-bg-btn');



    // --- 등장인물 요소 ---
    const characterListUl = document.getElementById('character-list');
    const addCharacterBtn = document.getElementById('add-character-btn');
    const characterDetailPanel = document.getElementById('character-detail-panel');
    const saveCharacterBtn = document.getElementById('save-character-btn');
    const deleteCharacterBtn = document.getElementById('delete-character-btn');

    const charNameInput = document.getElementById('char-name');
    const charGenderInput = document.getElementById('char-gender');
    const charRoleInput = document.getElementById('char-role');
    const charRaceInput = document.getElementById('char-race');
    const charOriginInput = document.getElementById('char-origin');
    const charAppearanceInput = document.getElementById('char-appearance');
    const charFeaturesInput = document.getElementById('char-features');
    const charAbilitiesInput = document.getElementById('char-abilities');
    const charPersonalityExtInput = document.getElementById('char-personality-ext');
    const charPersonalityIntInput = document.getElementById('char-personality-int');
    const charMotivationInput = document.getElementById('char-motivation');
    const charSpeechToneInput = document.getElementById('char-speech-tone');
    const charSpeechExamplesListUl = document.getElementById('char-speech-examples-list');
    const addSpeechExampleInput = document.getElementById('add-speech-example-input');
    const addSpeechExampleBtn = document.getElementById('add-speech-example-btn');
    const charBehaviorHabitsInput = document.getElementById('char-behavior-habits');
    const charBehaviorReactionsInput = document.getElementById('char-behavior-reactions');
    const charBehaviorCombatInput = document.getElementById('char-behavior-combat');
    const charPrefLikesInput = document.getElementById('char-pref-likes');
    const charPrefDislikesInput = document.getElementById('char-pref-dislikes');

    const charPastEventsListUl = document.getElementById('char-past-events-list');
    const addPastEventBtn = document.getElementById('add-past-event-btn');

    // --- 과거 사건 모달 요소 ---
    const pastEventModal = document.getElementById('past-event-modal');
    const eventSummaryInput = document.getElementById('event-summary');
    const eventDetailInput = document.getElementById('event-detail');
    const eventImpactInput = document.getElementById('event-impact');
    const savePastEventModalBtn = document.getElementById('save-past-event-modal-btn');

    let currentCharacterId = null; // 현재 편집 중인 캐릭터 ID (null이면 신규)
    let tempPastEvents = []; // 현재 편집 중인 캐릭터의 임시 과거 사건 리스트
    let tempSpeechExamples = []; // 현재 편집 중인 캐릭터의 임시 대사 예시 리스트
    let currentEditingEventIdx = null; // 모달로 편집 중인 이벤트의 인덱스 (null이면 신규)

    // 설정 패널 관련
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay'); // 설정 패널 및 프로젝트 모달용 공통 오버레이
    const settingsOpenBtn = document.getElementById('settings-open-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const panelCloseBtn = document.getElementById('panel-close-btn');
    const settingsCloseBtnInner = document.getElementById('settings-close-btn-inner');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

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
    const newProjectTagsInput = document.getElementById('new-project-tags'); // 추가
    const newProjectThumbnailInput = document.getElementById('new-project-thumbnail');
    const modalCreateBtn = document.getElementById('modal-create-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalTitle = document.querySelector('#create-project-modal h2'); // 추가

    // 패널 확대 관련
    const panelExpandBtn = document.getElementById('panel-expand-btn');
    const expandIcon = document.getElementById('expand-icon');
    const shrinkIcon = document.getElementById('shrink-icon');
    let editingProjectId = null; // 수정 시 사용할 ID

    // --- 전역 설정 모달 요소 ---
    const globalSettingsModal = document.getElementById('global-settings-modal');
    const globalCommandInput = document.getElementById('global-command');
    const globalInstructionInput = document.getElementById('global-instruction');
    const globalOutputRequirementsInput = document.getElementById('global-output-requirements');
    const globalRoleInput = document.getElementById('global-role');
    const globalTaskInput = document.getElementById('global-task');
    const globalDirectivesInput = document.getElementById('global-directives');
    const globalSettingsSaveBtn = document.getElementById('global-settings-save-btn');
    const globalSettingsCancelBtn = document.getElementById('global-settings-cancel-btn');
    const globalSettingsResetBtn = document.getElementById('global-settings-reset-btn'); // 추가

    // --- 기본값 설정 ---
    const defaultGlobalPromptSettings = {
        command: "WRITE_CHAPTER",
        instruction: "아래의 [설정값]과 [지금까지의 줄거리]를 완벽히 분석하여, [현재 챕터 범위]에 해당하는 소설 본문을 즉시 작성하시오.",
        output_requirements: "JSON 분석이나 사족(인사말)을 붙이지 말고, 오직 소설 제목과 본문 텍스트만을 일반적인 텍스트로 출력할 것.",
        role: "웹소설 전문 작가 (카카오페이지/네이버 시리즈 스타일)",
        task: "소설 텍스트 생성",
        directives: "속도감 있는 전개와 주인공의 압도적인 강함을 부각할 것. 결말은 열려 있으므로 현재 사건에 집중할 것."
    };
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
        if (settingsPanel) settingsPanel.classList.add('open');
        if (overlay) overlay.classList.add('visible');
        if (themeToggle) themeToggle.classList.add('hidden');
        if (panelCloseBtn) panelCloseBtn.classList.remove('hidden');
    }

    function closeSettings() {
        if (!settingsPanel) return;
        settingsPanel.classList.remove('open');

        // 현재 열려있는 다른 패널이 있는지 확인
        const isCharOpen = characterDetailPanel && !characterDetailPanel.classList.contains('hidden');
        const isGlobalOpen = globalSettingsModal && globalSettingsModal.classList.contains('visible');

        if (!isCharOpen && !isGlobalOpen) {
            overlay.classList.remove('visible');
            themeToggle.classList.remove('hidden');
            panelCloseBtn.classList.add('hidden');
        }
    }

    // --- 글자 수 계산 함수 (에디터 삭제로 제거) ---
    /* function updateCharCount() { ... } */


    // --- 소설 데이터 및 챕터 관리 (에디터 삭제로 제거) ---
    /* 관련 함수 일괄 비활성화 */


    // --- 뷰 관리 ---
    function showView(viewId) {
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            if (!view) return;
            if (view.id === viewId) {
                view.classList.remove('hidden');
                view.style.zIndex = '10';
            } else {
                view.classList.add('hidden');
                view.style.zIndex = '1';
            }
        });
        // 에디터 뷰 및 설정 버튼 노출 관련 로직 제거
    }

    // --- 프로젝트 관리 ---
    async function renderProjectList() {
        projects = await getAllProjects();
        projectListUl.innerHTML = '';
        if (projects.length === 0) {
            projectListUl.innerHTML = '<li class="no-projects">프로젝트가 없습니다. 새로 생성해주세요.</li>';
            return;
        }
        projects.forEach(project => {
            const li = document.createElement('li');
            li.dataset.projectId = project.id;

            // 썸네일 경로가 없으면 검은색 배경 표시
            let thumbHTML = project.thumbnail
                ? `<img src="${project.thumbnail}" class="project-thumb" alt="thumbnail">`
                : `<div class="project-thumb no-thumb"></div>`;

            // 태그 HTML 생성
            const tagsHTML = (project.tags || []).map(tag => `<span class="tag-badge">#${tag}</span>`).join('');

            li.innerHTML = `
                ${thumbHTML}
                <div class="project-info">
                    <span class="project-title">${project.name}</span>
                    <span class="project-description">${project.description || '설명 없음'}</span>
                    <div class="project-tags">${tagsHTML}</div>
                </div>
                <div class="project-menu-container">
                    <button class="kebab-btn" title="메뉴">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                    <div class="dropdown-menu">
                        <button class="dropdown-item edit">수정</button>
                        <button class="dropdown-item delete">삭제</button>
                    </div>
                </div>
            `;

            // 케밥 메뉴 및 드롭다운 로직
            const kebabBtn = li.querySelector('.kebab-btn');
            const dropdown = li.querySelector('.dropdown-menu');
            const editBtn = li.querySelector('.edit');
            const deleteBtn = li.querySelector('.delete');

            kebabBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // 다른 드롭다운 닫기
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m !== dropdown) m.classList.remove('visible');
                });
                dropdown.classList.toggle('visible');
            });

            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.remove('visible');
                openEditProjectModal(project);
            });

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.remove('visible');
                handleDeleteProject(project.id);
            });

            li.addEventListener('click', () => selectProject(project.id));
            projectListUl.appendChild(li);
        });
    }

    // 프로젝트 삭제 로직
    async function handleDeleteProject(projectId) {
        if (!confirm("정말로 이 프로젝트를 삭제하시겠습니까? 관련 데이터가 모두 삭제됩니다.")) return;

        try {
            const transaction = db.transaction([STORE_PROJECTS, STORE_NOVEL, STORE_SETTINGS], 'readwrite');
            transaction.objectStore(STORE_PROJECTS).delete(projectId);
            transaction.objectStore(STORE_NOVEL).delete(projectId);
            transaction.objectStore(STORE_SETTINGS).delete(projectId);

            transaction.oncomplete = async () => {
                await renderProjectList();
                alert("프로젝트가 삭제되었습니다.");
            };
        } catch (error) {
            console.error("Delete failed:", error);
            alert("프로젝트 삭제 중 오류가 발생했습니다.");
        }
    }

    // 프로젝트 수정 모달 열기
    function openEditProjectModal(project) {
        editingProjectId = project.id;
        modalTitle.textContent = "프로젝트 수정";
        modalCreateBtn.textContent = "수정하기";

        newProjectTitleInput.value = project.name;
        newProjectDescriptionInput.value = project.description || '';
        newProjectTagsInput.value = (project.tags || []).join(', ');
        newProjectThumbnailInput.value = '';

        createProjectModal.style.display = 'flex';
        requestAnimationFrame(() => {
            if (createProjectModal) createProjectModal.classList.add('visible');
            if (overlay) overlay.classList.add('visible');
        });
    }

    // 전역 설정 열기 (기본값 로직 추가)
    function openGlobalInstructionSettings() {
        const savedRaw = localStorage.getItem('global_novel_prompt_settings');
        const savedSettings = savedRaw ? JSON.parse(savedRaw) : defaultGlobalPromptSettings;

        globalCommandInput.value = savedSettings.command || '';
        globalInstructionInput.value = savedSettings.instruction || '';
        globalOutputRequirementsInput.value = savedSettings.output_requirements || '';
        globalRoleInput.value = savedSettings.role || '';
        globalTaskInput.value = savedSettings.task || '';
        globalDirectivesInput.value = savedSettings.directives || '';

        globalSettingsModal.style.display = 'flex';
        requestAnimationFrame(() => {
            globalSettingsModal.classList.add('visible');
            overlay.classList.add('visible');
            themeToggle.classList.add('hidden');
            panelCloseBtn.classList.remove('hidden');
        });
    }

    function closeGlobalSettingsModal() {
        if (globalSettingsModal) globalSettingsModal.classList.remove('visible');
        if (overlay) overlay.classList.remove('visible');
        if (themeToggle) themeToggle.classList.remove('hidden');
        if (panelCloseBtn) panelCloseBtn.classList.add('hidden');
        setTimeout(() => {
            if (globalSettingsModal) globalSettingsModal.style.display = 'none';
        }, 300);
    }

    globalSettingsSaveBtn.addEventListener('click', () => {
        const newSettings = {
            command: globalCommandInput.value.trim(),
            instruction: globalInstructionInput.value.trim(),
            output_requirements: globalOutputRequirementsInput.value.trim(),
            role: globalRoleInput.value.trim(),
            task: globalTaskInput.value.trim(),
            directives: globalDirectivesInput.value.trim()
        };

        localStorage.setItem('global_novel_prompt_settings', JSON.stringify(newSettings));
        alert("전역 설정이 저장되었습니다.");
        closeGlobalSettingsModal();
    });

    globalSettingsResetBtn.addEventListener('click', () => {
        if (!confirm("모든 지시 프롬프트 설정을 초기 기본값으로 되돌리시겠습니까?")) return;

        globalCommandInput.value = defaultGlobalPromptSettings.command;
        globalInstructionInput.value = defaultGlobalPromptSettings.instruction;
        globalOutputRequirementsInput.value = defaultGlobalPromptSettings.output_requirements;
        globalRoleInput.value = defaultGlobalPromptSettings.role;
        globalTaskInput.value = defaultGlobalPromptSettings.task;
        globalDirectivesInput.value = defaultGlobalPromptSettings.directives;

        alert("기본값으로 채워졌습니다. 반영하려면 저장 버튼을 눌러주세요.");
    });

    globalSettingsCancelBtn.addEventListener('click', closeGlobalSettingsModal);



    // 프로젝트 생성 모달 열기
    function openCreateProjectModal() {
        editingProjectId = null;
        modalTitle.textContent = "새 프로젝트 생성";
        modalCreateBtn.textContent = "생성하기";

        newProjectTitleInput.value = '';
        newProjectDescriptionInput.value = '';
        newProjectTagsInput.value = '';
        newProjectThumbnailInput.value = '';
        // file input value 리셋

        createProjectModal.style.display = 'flex';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (createProjectModal) createProjectModal.classList.add('visible');
                if (overlay) overlay.classList.add('visible');
            });
        });
    }

    // 프로젝트 생성 모달 닫기
    function closeCreateProjectModal() {
        if (createProjectModal) createProjectModal.classList.remove('visible');
        if (overlay) overlay.classList.remove('visible');
        setTimeout(() => {
            if (createProjectModal && !createProjectModal.classList.contains('visible')) {
                createProjectModal.style.display = 'none';
            }
        }, 300);
    }

    async function handleCreateProject() {
        const title = newProjectTitleInput.value.trim();
        const description = newProjectDescriptionInput.value.trim();
        const tagsRaw = newProjectTagsInput.value.trim();
        const thumbnailFile = newProjectThumbnailInput.files[0];

        if (!title) {
            alert("소설 제목은 필수입니다.");
            return;
        }

        const tags = tagsRaw ? tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag !== "") : [];

        let thumbnailData = null;
        if (thumbnailFile) {
            thumbnailData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(thumbnailFile);
            });
        }

        if (editingProjectId) {
            // 수정 모드
            const project = projects.find(p => p.id === editingProjectId);
            if (!project) return;

            project.name = title;
            project.description = description;
            project.tags = tags;
            if (thumbnailData) project.thumbnail = thumbnailData;

            await setToStore(STORE_PROJECTS, null, project);
            alert("프로젝트가 수정되었습니다.");
        } else {
            // 생성 모드
            const projectId = Date.now().toString();
            const newProject = {
                id: projectId,
                name: title,
                description: description,
                tags: tags,
                thumbnail: thumbnailData,
                creationDate: new Date().toISOString()
            };

            await setToStore(STORE_PROJECTS, null, newProject);
            await setToStore(STORE_NOVEL, projectId, [{ title: '첫 번째 챕터', content: '' }]);
            await setToStore(STORE_SETTINGS, projectId, defaultSettings);
            alert("프로젝트가 생성되었습니다.");
        }

        await renderProjectList();
        closeCreateProjectModal();
    }


    async function selectProject(projectId) {
        currentProjectId = projectId;
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        // 상세 정보 채우기
        detailTitle.textContent = project.name;
        detailDescription.textContent = project.description || '설명 없음';

        // 상세 정보 상세 페이지용 태그 렌더링
        renderDetailTags(project);

        // 세부 설정값 불러오기
        const settings = project.novelSettings || {};
        projSettingEmotion.value = settings.emotion || '';
        projSettingGratification.value = settings.gratification || '';
        projSettingFocus.value = settings.focus || '';
        projSettingPov.value = settings.pov || '';
        projSettingTone.value = settings.tone || '';
        projSettingRules.value = settings.rules || '';

        // 배경 지식 데이터 불러오기
        const bgSettings = project.backgroundSettings || {};
        projBgWorld.value = bgSettings.world || '';
        projBgEvents.value = bgSettings.events || '';

        // 등장인물 목록 렌더링
        renderCharacterList(project.characters || []);
        closeCharacterPanel(); // 패널 초기화

        if (project.thumbnail && detailThumbnail) {
            detailThumbnail.style.backgroundImage = `url(${project.thumbnail})`;
            detailThumbnail.classList.remove('no-thumb');
        } else if (detailThumbnail) {
            detailThumbnail.style.backgroundImage = 'none';
            detailThumbnail.classList.add('no-thumb');
        }

        // 탭 초기화 (첫 번째 탭: 설정 활성화)
        document.querySelectorAll('.tab-btn').forEach(btn => btn && btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane && pane.classList.remove('active'));

        const settingsTabBtn = document.querySelector('.tab-btn[data-tab="tab-settings"]');
        if (settingsTabBtn) settingsTabBtn.classList.add('active');

        const settingsTabPane = document.getElementById('tab-settings');
        if (settingsTabPane) settingsTabPane.classList.add('active');

        showView('project-detail-view');
    }


    // --- 이벤트 리스너 등록 (초기화 전에 등록하여 UI 반응성 확보) ---
    settingsOpenBtn.addEventListener('click', openSettings);

    // 오버레이 클릭 시 모든 열린 패널/모달 닫기
    overlay.addEventListener('click', () => {
        if (settingsPanel && settingsPanel.classList.contains('open')) closeSettings();
        if (createProjectModal && createProjectModal.classList.contains('visible')) closeCreateProjectModal();
        if (globalSettingsModal && globalSettingsModal.classList.contains('visible')) closeGlobalSettingsModal();
        if (characterDetailPanel && !characterDetailPanel.classList.contains('hidden')) closeCharacterPanel();
    });

    // 패널 전용 닫기 버튼 클릭 시 (인물 상세 패널 및 설정 패널)
    const closeAllPanels = () => {
        if (settingsPanel && settingsPanel.classList.contains('open')) closeSettings();
        if (globalSettingsModal && globalSettingsModal.classList.contains('visible')) closeGlobalSettingsModal();
        if (characterDetailPanel && !characterDetailPanel.classList.contains('hidden')) closeCharacterPanel();
    };

    if (panelCloseBtn) panelCloseBtn.addEventListener('click', closeAllPanels);
    if (settingsCloseBtnInner) settingsCloseBtnInner.addEventListener('click', closeAllPanels);

    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(m => {
            if (m) m.classList.remove('visible');
        });
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

    // 상세 페이지 태그 렌더링 함수
    function renderDetailTags(project) {
        detailTagsContainer.innerHTML = '';
        (project.tags || []).forEach((tag, index) => {
            const span = document.createElement('span');
            span.className = 'tag-badge';
            span.innerHTML = `#${tag} <span class="remove-tag" data-index="${index}">&times;</span>`;

            // 태그 삭제 이벤트
            span.querySelector('.remove-tag').addEventListener('click', async (e) => {
                e.stopPropagation();
                project.tags.splice(index, 1);
                await updateProjectTags(project);
            });

            detailTagsContainer.appendChild(span);
        });
    }

    // 태그 데이터 업데이트 및 저장
    async function updateProjectTags(project) {
        try {
            await setToStore(STORE_PROJECTS, null, project);
            renderDetailTags(project);
            await renderProjectList(); // 메인 목록도 갱신
        } catch (error) {
            console.error("Failed to update tags:", error);
            alert("태그 업데이트에 실패했습니다.");
        }
    }

    // 태그 추가 이벤트 연결
    addTagBtn.addEventListener('click', async () => {
        const project = projects.find(p => p.id === currentProjectId);
        if (!project) return;

        const newTag = prompt("추가할 태그를 입력하세요:");
        if (newTag && newTag.trim()) {
            if (!project.tags) project.tags = [];
            const tagValue = newTag.trim();
            if (!project.tags.includes(tagValue)) {
                project.tags.push(tagValue);
                await updateProjectTags(project);
            } else {
                alert("이미 존재하는 태그입니다.");
            }
        }
    });

    // 상세 설정 저장 이벤트
    saveProjSettingsBtn.addEventListener('click', async () => {
        const project = projects.find(p => p.id === currentProjectId);
        if (!project) return;

        project.novelSettings = {
            emotion: projSettingEmotion.value.trim(),
            gratification: projSettingGratification.value.trim(),
            focus: projSettingFocus.value.trim(),
            pov: projSettingPov.value.trim(),
            tone: projSettingTone.value.trim(),
            rules: projSettingRules.value.trim()
        };

        try {
            await setToStore(STORE_PROJECTS, null, project);
            alert("프로젝트 설정이 저장되었습니다.");
        } catch (error) {
            console.error("Save settings failed:", error);
            alert("설정 저장 중 오류가 발생했습니다.");
        }
    });

    // 배경 지식 저장 이벤트
    saveProjBgBtn.addEventListener('click', async () => {
        const project = projects.find(p => p.id === currentProjectId);
        if (!project) return;

        project.backgroundSettings = {
            world: projBgWorld.value.trim(),
            events: projBgEvents.value.trim()
        };

        try {
            await setToStore(STORE_PROJECTS, null, project);
            alert("배경 지식이 저장되었습니다.");
        } catch (error) {
            console.error("Save background knowledge failed:", error);
            alert("배경 지식 저장 중 오류가 발생했습니다.");
        }
    });

    // --- 등장인물 관리 로직 ---
    function renderCharacterList(characters) {
        characterListUl.innerHTML = '';
        if (characters.length === 0) {
            characterListUl.innerHTML = '<li style="color: var(--text-secondary); grid-column: 1/-1; text-align: center; padding: 40px;">등록된 등장인물이 없습니다.</li>';
            return;
        }

        characters.forEach(char => {
            const li = document.createElement('li');
            li.className = 'item-card';
            if (currentCharacterId === char.id) li.classList.add('active');

            li.innerHTML = `
                <div class="item-name">${char.name}</div>
                <div class="item-meta">${char.role || '역할 미지정'} | ${char.race || '종족 미상'}</div>
            `;

            li.addEventListener('click', () => openCharacterPanel(char));
            characterListUl.appendChild(li);
        });
    }

    function openCharacterPanel(char = null) {
        if (char) {
            currentCharacterId = char.id;
            charNameInput.value = char.name;
            charGenderInput.value = char.gender || '';
            charRoleInput.value = char.role || '';
            charRaceInput.value = char.race || '';
            charOriginInput.value = char.origin || '';
            charAppearanceInput.value = char.appearance || '';
            charFeaturesInput.value = char.features || '';
            charAbilitiesInput.value = char.abilities || '';
            charPersonalityExtInput.value = char.personalityExt || '';
            charPersonalityIntInput.value = char.personalityInt || '';
            charMotivationInput.value = char.motivation || '';
            charSpeechToneInput.value = char.speechTone || '';
            charBehaviorHabitsInput.value = char.behaviorHabits || '';
            charBehaviorReactionsInput.value = char.behaviorReactions || '';
            charBehaviorCombatInput.value = char.behaviorCombat || '';
            charPrefLikesInput.value = char.prefLikes || '';
            charPrefDislikesInput.value = char.prefDislikes || '';
            tempPastEvents = char.pastEvents ? [...char.pastEvents] : [];
            tempSpeechExamples = char.speechExamples ? (Array.isArray(char.speechExamples) ? [...char.speechExamples] : [char.speechExamples]) : [];
            renderPastEventsList();
            renderSpeechExamplesList();
            deleteCharacterBtn.style.display = 'block';
        } else {
            currentCharacterId = null;
            charNameInput.value = '';
            charGenderInput.value = '';
            charRoleInput.value = '';
            charRaceInput.value = '';
            charOriginInput.value = '';
            charAppearanceInput.value = '';
            charFeaturesInput.value = '';
            charAbilitiesInput.value = '';
            charPersonalityExtInput.value = '';
            charPersonalityIntInput.value = '';
            charMotivationInput.value = '';
            charSpeechToneInput.value = '';
            charBehaviorHabitsInput.value = '';
            charBehaviorReactionsInput.value = '';
            charBehaviorCombatInput.value = '';
            charPrefLikesInput.value = '';
            charPrefDislikesInput.value = '';
            tempPastEvents = [];
            tempSpeechExamples = [];
            renderPastEventsList();
            renderSpeechExamplesList();
            deleteCharacterBtn.style.display = 'none';
        }

        if (characterDetailPanel) {
            characterDetailPanel.classList.remove('hidden');
            // 실제 스크롤바가 있는 내부 컨테이너의 스크롤을 최상단으로 초기화
            const scrollContainer = characterDetailPanel.querySelector('.form-container');
            if (scrollContainer) scrollContainer.scrollTop = 0;
        }
        if (themeToggle) themeToggle.classList.add('hidden');
        if (panelCloseBtn) panelCloseBtn.classList.remove('hidden');
        if (overlay) overlay.classList.add('visible');
        // 활성화 상태 표시를 위해 목록 다시 렌더링
        const project = projects.find(p => p.id === currentProjectId);
        if (project) renderCharacterList(project.characters || []);
    }

    function closeCharacterPanel() {
        if (characterDetailPanel) {
            characterDetailPanel.classList.add('hidden');
            characterDetailPanel.classList.remove('expanded'); // 축소 상태로 초기화
            if (expandIcon) expandIcon.classList.remove('hidden');
            if (shrinkIcon) shrinkIcon.classList.add('hidden');
        }
        currentCharacterId = null;

        // 다른 모달이나 패널이 열려있는지 확인
        const isSettingsOpen = settingsPanel && settingsPanel.classList.contains('open');
        const isGlobalOpen = globalSettingsModal && globalSettingsModal.classList.contains('visible');

        if (!isSettingsOpen && !isGlobalOpen) {
            if (overlay) overlay.classList.remove('visible');
            if (themeToggle) themeToggle.classList.remove('hidden');
            if (panelCloseBtn) panelCloseBtn.classList.add('hidden');
        }

        const project = projects.find(p => p.id === currentProjectId);
        if (project) renderCharacterList(project.characters || []);
    }

    addCharacterBtn.addEventListener('click', () => openCharacterPanel());

    // 상세 패널 확대/축소 이벤트
    if (panelExpandBtn) {
        panelExpandBtn.addEventListener('click', () => {
            if (!characterDetailPanel) return;
            const isExpanded = characterDetailPanel.classList.toggle('expanded');

            if (isExpanded) {
                if (expandIcon) expandIcon.classList.add('hidden');
                if (shrinkIcon) shrinkIcon.classList.remove('hidden');
            } else {
                if (expandIcon) expandIcon.classList.remove('hidden');
                if (shrinkIcon) shrinkIcon.classList.add('hidden');
            }
        });
    }

    saveCharacterBtn.addEventListener('click', async () => {
        const name = charNameInput.value.trim();
        if (!name) {
            alert("이름을 입력해주세요.");
            return;
        }

        const project = projects.find(p => p.id === currentProjectId);
        if (!project) return;

        if (!project.characters) project.characters = [];

        if (currentCharacterId) {
            // 수정
            const idx = project.characters.findIndex(c => c.id === currentCharacterId);
            if (idx !== -1) {
                project.characters[idx] = {
                    ...project.characters[idx],
                    name,
                    gender: charGenderInput.value.trim(),
                    role: charRoleInput.value.trim(),
                    race: charRaceInput.value.trim(),
                    origin: charOriginInput.value.trim(),
                    appearance: charAppearanceInput.value.trim(),
                    features: charFeaturesInput.value.trim(),
                    abilities: charAbilitiesInput.value.trim(),
                    personalityExt: charPersonalityExtInput.value.trim(),
                    personalityInt: charPersonalityIntInput.value.trim(),
                    motivation: charMotivationInput.value.trim(),
                    speechTone: charSpeechToneInput.value.trim(),
                    speechExamples: [...tempSpeechExamples],
                    behaviorHabits: charBehaviorHabitsInput.value.trim(),
                    behaviorReactions: charBehaviorReactionsInput.value.trim(),
                    behaviorCombat: charBehaviorCombatInput.value.trim(),
                    prefLikes: charPrefLikesInput.value.trim(),
                    prefDislikes: charPrefDislikesInput.value.trim(),
                    pastEvents: [...tempPastEvents]
                };
            }
        } else {
            // 신규 추가
            const newChar = {
                id: Date.now().toString(),
                name,
                gender: charGenderInput.value.trim(),
                role: charRoleInput.value.trim(),
                race: charRaceInput.value.trim(),
                origin: charOriginInput.value.trim(),
                appearance: charAppearanceInput.value.trim(),
                features: charFeaturesInput.value.trim(),
                abilities: charAbilitiesInput.value.trim(),
                personalityExt: charPersonalityExtInput.value.trim(),
                personalityInt: charPersonalityIntInput.value.trim(),
                motivation: charMotivationInput.value.trim(),
                speechTone: charSpeechToneInput.value.trim(),
                speechExamples: [...tempSpeechExamples],
                behaviorHabits: charBehaviorHabitsInput.value.trim(),
                behaviorReactions: charBehaviorReactionsInput.value.trim(),
                behaviorCombat: charBehaviorCombatInput.value.trim(),
                prefLikes: charPrefLikesInput.value.trim(),
                prefDislikes: charPrefDislikesInput.value.trim(),
                pastEvents: [...tempPastEvents]
            };
            project.characters.push(newChar);
        }

        try {
            await setToStore(STORE_PROJECTS, null, project);
            renderCharacterList(project.characters);
            closeCharacterPanel();
            alert("인물 정보가 저장되었습니다.");
        } catch (error) {
            console.error("Save character failed:", error);
        }
    });

    deleteCharacterBtn.addEventListener('click', async () => {
        if (!confirm("이 인물 정보를 삭제하시겠습니까?")) return;

        const project = projects.find(p => p.id === currentProjectId);
        if (!project || !currentCharacterId) return;

        project.characters = project.characters.filter(c => c.id !== currentCharacterId);

        try {
            await setToStore(STORE_PROJECTS, null, project);
            renderCharacterList(project.characters);
            closeCharacterPanel();
            alert("삭제되었습니다.");
        } catch (error) {
            console.error("Delete character failed:", error);
        }
    });

    // --- 과거 사건 리스트 렌더링 및 모달 로직 ---
    function renderPastEventsList() {
        charPastEventsListUl.innerHTML = '';
        if (tempPastEvents.length === 0) {
            charPastEventsListUl.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; padding: 10px;">등록된 과거 사건이 없습니다.</div>';
            return;
        }

        tempPastEvents.forEach((event, idx) => {
            const div = document.createElement('div');
            div.className = 'sub-item-card';
            div.innerHTML = `
                <div class="sub-item-title">${event.summary}</div>
                <div class="sub-item-desc">${event.detail}</div>
                <button class="sub-item-delete" data-idx="${idx}">&times;</button>
            `;
            div.addEventListener('click', (e) => {
                if (e.target.classList.contains('sub-item-delete')) return;
                openPastEventModal(idx);
            });
            div.querySelector('.sub-item-delete').addEventListener('click', () => {
                tempPastEvents.splice(idx, 1);
                renderPastEventsList();
            });
            charPastEventsListUl.appendChild(div);
        });
    }

    // --- 대사 예시 리스트 렌더링 ---
    function renderSpeechExamplesList() {
        if (!charSpeechExamplesListUl) return;
        charSpeechExamplesListUl.innerHTML = '';
        if (tempSpeechExamples.length === 0) {
            charSpeechExamplesListUl.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; padding: 10px;">등록된 대사 예시가 없습니다.</div>';
            return;
        }

        tempSpeechExamples.forEach((speech, idx) => {
            const div = document.createElement('div');
            div.className = 'speech-example-item';
            div.innerHTML = `
                <span>${speech}</span>
                <button class="item-delete-btn" data-idx="${idx}">&times;</button>
            `;
            div.querySelector('.item-delete-btn').addEventListener('click', () => {
                tempSpeechExamples.splice(idx, 1);
                renderSpeechExamplesList();
            });
            charSpeechExamplesListUl.appendChild(div);
        });
    }

    // 대사 예시 추가 이벤트
    if (addSpeechExampleBtn) {
        addSpeechExampleBtn.addEventListener('click', () => {
            const value = addSpeechExampleInput.value.trim();
            if (value) {
                tempSpeechExamples.push(value);
                addSpeechExampleInput.value = '';
                renderSpeechExamplesList();
            }
        });
    }

    if (addSpeechExampleInput) {
        addSpeechExampleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addSpeechExampleBtn.click();
            }
        });
    }

    function openPastEventModal(idx = null) {
        currentEditingEventIdx = idx;
        if (idx !== null) {
            const event = tempPastEvents[idx];
            eventSummaryInput.value = event.summary;
            eventDetailInput.value = event.detail;
            eventImpactInput.value = event.impact;
            savePastEventModalBtn.textContent = '수정 완료';
        } else {
            eventSummaryInput.value = '';
            eventDetailInput.value = '';
            eventImpactInput.value = '';
            savePastEventModalBtn.textContent = '리스트에 추가';
        }

        if (pastEventModal) pastEventModal.style.display = 'flex';
        if (overlay) overlay.style.display = 'block';
        requestAnimationFrame(() => {
            if (pastEventModal) pastEventModal.classList.add('visible');
            if (overlay) overlay.classList.add('visible');
        });
    }

    function closePastEventModal() {
        if (!pastEventModal) return;
        pastEventModal.classList.remove('visible');

        // 다른 패널이 열려있지 않은 경우에만 오버레이 제거
        const isChatOpen = characterDetailPanel && !characterDetailPanel.classList.contains('hidden');
        const isSettingsOpen = settingsPanel && settingsPanel.classList.contains('open');
        const isGlobalOpen = globalSettingsModal && globalSettingsModal.classList.contains('visible');

        if (!isChatOpen && !isSettingsOpen && !isGlobalOpen) {
            overlay.classList.remove('visible');
            setTimeout(() => {
                if (overlay && !overlay.classList.contains('visible')) {
                    overlay.style.display = 'none';
                }
            }, 300);
        }

        setTimeout(() => {
            if (pastEventModal) pastEventModal.style.display = 'none';
        }, 300);
    }

    addPastEventBtn.addEventListener('click', () => openPastEventModal());
    pastEventModal.querySelector('.cancel-modal').addEventListener('click', closePastEventModal);

    savePastEventModalBtn.addEventListener('click', () => {
        const summary = eventSummaryInput.value.trim();
        if (!summary) {
            alert("사건 요약을 입력해주세요.");
            return;
        }

        const eventData = {
            summary,
            detail: eventDetailInput.value.trim(),
            impact: eventImpactInput.value.trim()
        };

        if (currentEditingEventIdx !== null) {
            tempPastEvents[currentEditingEventIdx] = eventData;
        } else {
            tempPastEvents.push(eventData);
        }

        renderPastEventsList();
        closePastEventModal();
    });

    // --- 테마 전환 로직 ---
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
    }

    function updateThemeIcons(theme) {
        if (!sunIcon || !moonIcon) return;
        if (theme === 'dark') {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    });

    initTheme();

    const globalDirectivesBtn = document.getElementById('global-directives-btn');
    globalDirectivesBtn.addEventListener('click', openGlobalInstructionSettings);

    modalCreateBtn.addEventListener('click', handleCreateProject);


    modalCancelBtn.addEventListener('click', closeCreateProjectModal);
    createProjectBtn.addEventListener('click', openCreateProjectModal);

    // 목록으로 돌아가기 버튼
    backToMenuFromDetail.addEventListener('click', () => {
        currentProjectId = null;
        showView('menu-view');
    });

    // 탭 전환 로직
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            if (!targetTab) return;

            // 버튼 활성화 상태 변경
            document.querySelectorAll('.tab-btn').forEach(b => {
                if (b) b.classList.remove('active');
            });
            btn.classList.add('active');

            // 콘텐츠 전환
            document.querySelectorAll('.tab-pane').forEach(pane => {
                if (pane) pane.classList.remove('active');
            });
            const targetPane = document.getElementById(targetTab);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    projectListUl.addEventListener('click', async (e) => {
        const li = e.target.closest('li[data-project-id]');
        if (li && li.dataset.projectId) {
            await selectProject(li.dataset.projectId);
        }
    });

    /* 에디터 관련 이벤트 리스너 제거 */



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
