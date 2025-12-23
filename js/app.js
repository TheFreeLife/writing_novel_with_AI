/**
 * js/app.js
 * 메인 애플리케이션 모듈
 */

import { StorageManager } from './storage.js';
import { UIHelper } from './ui-helper.js';
import { ListModule } from './list-module.js';
import { renderRelationshipMap } from './relationship-map.js';

class NovelApp {
    constructor() {
        this.projects = [];
        this.currentProjectId = null;
        this.currentSettings = null;
        this.tempPastEvents = [];
        this.tempSpeechExamples = [];
        this.tempLikes = [];
        this.tempDislikes = [];
        this.currentCharacterId = null;
        this.currentProgressionId = null;
        this.currentForeshadowingId = null;
        this.currentDictionaryId = null;
        this.currentRelationship = null;
        this.isNewRelationship = false;
        this.editingProjectId = null;
        this.currentEditingEventIdx = null;
        this.currentEditingCategoryIndex = null;
        this.currentEditingBgEventIndex = null;

        this.initDOM();
        this.bindEvents();
    }

    initDOM() {
        this.dom = {
            menuView: document.getElementById('menu-view'),
            projectDetailView: document.getElementById('project-detail-view'),
            projectListUl: document.getElementById('project-list'),
            createProjectBtn: document.getElementById('create-project-btn'),
            overlay: document.getElementById('overlay'),
            themeToggle: document.getElementById('theme-toggle'),
            sunIcon: document.getElementById('sun-icon'),
            moonIcon: document.getElementById('moon-icon'),

            createProjectModal: document.getElementById('create-project-modal'),
            modalTitle: document.querySelector('#create-project-modal h2'),
            newProjectTitle: document.getElementById('new-project-title'),
            newProjectDesc: document.getElementById('new-project-description'),
            newProjectTags: document.getElementById('new-project-tags'),
            newProjectThumbnail: document.getElementById('new-project-thumbnail'),
            modalCreateBtn: document.getElementById('modal-create-btn'),
            modalCancelBtn: document.getElementById('modal-cancel-btn'),

            detailTitle: document.getElementById('detail-project-title'),
            detailDescription: document.getElementById('detail-project-description'),
            detailThumbnail: document.getElementById('detail-project-thumbnail'),
            detailTagsContainer: document.getElementById('detail-project-tags'),
            addTagBtn: document.getElementById('add-tag-btn'),
            backToMenu: document.getElementById('back-to-menu-from-detail'),

            projEmotion: document.getElementById('proj-setting-emotion'),
            projGratification: document.getElementById('proj-setting-gratification'),
            projFocus: document.getElementById('proj-setting-focus'),
            projPov: document.getElementById('proj-setting-pov'),
            projTone: document.getElementById('proj-setting-tone'),
            projRules: document.getElementById('proj-setting-rules'),
            saveProjSettingsBtn: document.getElementById('save-proj-settings-btn'),

            projBgWorld: document.getElementById('proj-bg-world'),
            saveProjBgBtn: document.getElementById('save-proj-bg-btn'),

            projBgEventsList: document.getElementById('proj-bg-events-list'),
            addProjBgEventBtn: document.getElementById('add-proj-bg-event-btn'),
            projBgEventModal: document.getElementById('proj-bg-event-modal'),
            projBgEventInputs: {
                time: document.getElementById('proj-bg-event-time'),
                name: document.getElementById('proj-bg-event-name'),
                detail: document.getElementById('proj-bg-event-detail'),
                impact: document.getElementById('proj-bg-event-impact'),
            },
            saveProjBgEventModalBtn: document.getElementById('save-proj-bg-event-modal-btn'),

            charListUl: document.getElementById('character-list'),
            addCharBtn: document.getElementById('add-character-btn'),
            charDetailPanel: document.getElementById('character-detail-panel'),
            saveCharBtn: document.getElementById('save-character-btn'),
            deleteCharBtn: document.getElementById('delete-character-btn'),
            panelExpandBtn: document.getElementById('panel-expand-btn'),
            expandIcon: document.getElementById('expand-icon'),
            shrinkIcon: document.getElementById('shrink-icon'),
            panelCloseBtn: document.getElementById('panel-close-btn'),

            charInputs: {
                name: document.getElementById('char-name'),
                gender: document.getElementById('char-gender'),
                role: document.getElementById('char-role'),
                race: document.getElementById('char-race'),
                origin: document.getElementById('char-origin'),
                appearance: document.getElementById('char-appearance'),
                features: document.getElementById('char-features'),
                abilities: document.getElementById('char-abilities'),
                personalityExt: document.getElementById('char-personality-ext'),
                personalityInt: document.getElementById('char-personality-int'),
                motivation: document.getElementById('char-motivation'),
                speechTone: document.getElementById('char-speech-tone'),
                behaviorHabits: document.getElementById('char-behavior-habits'),
                behaviorReactions: document.getElementById('char-behavior-reactions'),
                behaviorCombat: document.getElementById('char-behavior-combat'),
            },
            speechExamplesList: document.getElementById('char-speech-examples-list'),
            addSpeechInput: document.getElementById('add-speech-example-input'),
            addSpeechBtn: document.getElementById('add-speech-example-btn'),
            likesList: document.getElementById('char-likes-list'),
            addLikeInput: document.getElementById('add-like-input'),
            addLikeBtn: document.getElementById('add-like-btn'),
            dislikesList: document.getElementById('char-dislikes-list'),
            addDislikeInput: document.getElementById('add-dislike-input'),
            addDislikeBtn: document.getElementById('add-dislike-btn'),
            pastEventsList: document.getElementById('char-past-events-list'),
            addPastEventBtn: document.getElementById('add-past-event-btn'),

            pastEventModal: document.getElementById('past-event-modal'),
            eventSummary: document.getElementById('event-summary'),
            eventDetail: document.getElementById('event-detail'),
            eventImpact: document.getElementById('event-impact'),
            savePastEventModalBtn: document.getElementById('save-past-event-modal-btn'),

            progListUl: document.getElementById('progression-list'),
            addProgBtn: document.getElementById('add-progression-btn'),
            progDetailPanel: document.getElementById('progression-detail-panel'),
            saveProgBtn: document.getElementById('save-progression-btn'),
            deleteProgBtn: document.getElementById('delete-progression-btn'),
            progEpisodeDisplay: document.getElementById('prog-episode-display'),
            progSummary: document.getElementById('prog-summary'),
            progPoints: document.getElementById('prog-points'),
            progExpandBtn: document.getElementById('prog-panel-expand-btn'),
            progExpandIcon: document.getElementById('prog-expand-icon'),
            progShrinkIcon: document.getElementById('prog-shrink-icon'),
            progCloseBtn: document.getElementById('prog-panel-close-btn'),

            foreshadowingListUl: document.getElementById('foreshadowing-list'),
            addForeshadowingBtn: document.getElementById('add-foreshadowing-btn'),
            foreshadowingDetailPanel: document.getElementById('foreshadowing-detail-panel'),
            saveForeshadowingBtn: document.getElementById('save-foreshadowing-btn'),
            deleteForeshadowingBtn: document.getElementById('delete-foreshadowing-btn'),
            foreshadowingInputs: {
                name: document.getElementById('foreshadowing-name'),
                hiddenFact: document.getElementById('foreshadowing-hidden-fact'),
                clue: document.getElementById('foreshadowing-clue'),
                revealTiming: document.getElementById('foreshadowing-reveal-timing'),
            },
            foreshadowingExpandBtn: document.getElementById('foreshadowing-panel-expand-btn'),
            foreshadowingExpandIcon: document.getElementById('foreshadowing-expand-icon'),
            foreshadowingShrinkIcon: document.getElementById('foreshadowing-shrink-icon'),
            foreshadowingCloseBtn: document.getElementById('foreshadowing-panel-close-btn'),

            dictListUl: document.getElementById('dict-list'),
            addDictBtn: document.getElementById('add-dict-btn'),
            dictDetailPanel: document.getElementById('dict-detail-panel'),
            saveDictBtn: document.getElementById('save-dict-btn'),
            deleteDictBtn: document.getElementById('delete-dict-btn'),
            dictExpandBtn: document.getElementById('dict-panel-expand-btn'),
            dictExpandIcon: document.getElementById('dict-expand-icon'),
            dictShrinkIcon: document.getElementById('dict-shrink-icon'),
            dictCloseBtn: document.getElementById('dict-panel-close-btn'),
            dictInputs: {
                name: document.getElementById('dict-name'),
                category: document.getElementById('dict-category'),
                description: document.getElementById('dict-description'),
            },

            relDetailPanel: document.getElementById('relationship-detail-panel'),
            saveRelBtn: document.getElementById('save-relationship-btn'),
            deleteRelBtn: document.getElementById('delete-relationship-btn'),
            relExpandBtn: document.getElementById('rel-panel-expand-btn'),
            relExpandIcon: document.getElementById('rel-expand-icon'),
            relShrinkIcon: document.getElementById('rel-shrink-icon'),
            relCloseBtn: document.getElementById('rel-panel-close-btn'),
            relCharactersDisplay: document.getElementById('rel-characters-display'),
            relInputs: {
                label: document.getElementById('rel-label'),
                feelings: document.getElementById('rel-feelings'),
                past: document.getElementById('rel-past'),
                speech: document.getElementById('rel-speech'),
            },

            editDictCategoryBtn: document.getElementById('edit-dict-category-btn'),
            dictCategoryModal: document.getElementById('dict-category-modal'),
            closeDictCategoryModalBtn: document.getElementById('close-dict-category-modal-btn'),
            dictCategoryList: document.getElementById('dict-category-list'),
            dictCategoryInput: document.getElementById('dict-category-input'),
            saveDictCategoryBtn: document.getElementById('save-dict-category-btn'),


            globalModal: document.getElementById('global-settings-modal'),
            globalInputs: {
                command: document.getElementById('global-command'),
                instruction: document.getElementById('global-instruction'),
                output: document.getElementById('global-output-requirements'),
                role: document.getElementById('global-role'),
                task: document.getElementById('global-task'),
                directives: document.getElementById('global-directives'),
            },
            saveGlobalBtn: document.getElementById('global-settings-save-btn'),
            cancelGlobalBtn: document.getElementById('global-settings-cancel-btn'),
            resetGlobalBtn: document.getElementById('global-settings-reset-btn'),
            openGlobalBtn: document.getElementById('global-directives-btn'),

            settingsPanel: document.getElementById('settings-panel'),
            settingsOpenBtn: document.getElementById('settings-open-btn'),
            settingsCloseBtnInner: document.getElementById('settings-close-btn-inner'),
            sizeRange: document.getElementById('setting-font-size-range'),
            sizeNumber: document.getElementById('setting-font-size-number'),
            bgInput: document.getElementById('setting-bg-color'),
            fontInput: document.getElementById('setting-font-color'),
            familySelect: document.getElementById('setting-font-family'),
            relMapExpandBtn: document.getElementById('rel-map-expand-btn'),
            relMapShrinkBtn: document.getElementById('rel-map-shrink-btn'),
            relMapFullscreenOverlay: document.getElementById('rel-map-fullscreen-overlay'),
            relMapFullscreenContainer: document.getElementById('relationship-map-fullscreen-container')
        };
    }

    bindEvents() {
        this.dom.relMapExpandBtn.addEventListener('click', () => this.toggleRelMapFullscreen(true));
        this.dom.relMapShrinkBtn.addEventListener('click', () => this.toggleRelMapFullscreen(false));
        this.dom.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.dom.backToMenu.addEventListener('click', () => {
            this.currentProjectId = null;
            UIHelper.showView('menu-view');
        });

        this.dom.createProjectBtn.addEventListener('click', () => this.openProjectModal());
        this.dom.modalCancelBtn.addEventListener('click', () => this.closeProjectModal());
        this.dom.modalCreateBtn.addEventListener('click', () => this.handleProjectSubmit());
        this.dom.overlay.addEventListener('click', () => this.closeAllOverlappingUIs());

        const closeAll = () => this.closeAllOverlappingUIs();
        [this.dom.panelCloseBtn, this.dom.progCloseBtn, this.dom.foreshadowingCloseBtn, this.dom.dictCloseBtn, this.dom.relCloseBtn, this.dom.settingsCloseBtnInner].forEach(btn => btn?.addEventListener('click', closeAll));

        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('visible'));
        });

        document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => this.switchTab(btn)));

        this.dom.addTagBtn.addEventListener('click', () => this.handleAddTag());
        this.dom.saveProjSettingsBtn.addEventListener('click', () => this.saveProjectSettings());
        this.dom.saveProjBgBtn.addEventListener('click', () => this.saveBackgroundKnowledge());

        this.dom.addProjBgEventBtn.addEventListener('click', () => this.openBackgroundEventModal());
        this.dom.saveProjBgEventModalBtn.addEventListener('click', () => this.saveBackgroundEvent());
        this.dom.projBgEventModal.querySelector('.cancel-modal').addEventListener('click', () => this.closeBackgroundEventModal());


        this.dom.addCharBtn.addEventListener('click', () => this.openCharacterPanel());
        this.dom.saveCharBtn.addEventListener('click', () => this.saveCharacter());
        this.dom.deleteCharBtn.addEventListener('click', () => this.deleteCharacter());
        this.dom.panelExpandBtn.addEventListener('click', () => this.togglePanelExpand('charDetailPanel', 'expandIcon', 'shrinkIcon'));
        this.dom.addSpeechBtn.addEventListener('click', () => this.addSpeechExample());
        this.dom.addSpeechInput.addEventListener('keypress', (e) => e.key === 'Enter' && this.addSpeechExample());

        this.dom.addLikeBtn.addEventListener('click', () => this.addListItem('tempLikes', 'addLikeInput', () => this.renderSimpleList('likesList', this.tempLikes)));
        this.dom.addLikeInput.addEventListener('keypress', (e) => e.key === 'Enter' && this.addListItem('tempLikes', 'addLikeInput', () => this.renderSimpleList('likesList', this.tempLikes)));

        this.dom.addDislikeBtn.addEventListener('click', () => this.addListItem('tempDislikes', 'addDislikeInput', () => this.renderSimpleList('dislikesList', this.tempDislikes)));
        this.dom.addDislikeInput.addEventListener('keypress', (e) => e.key === 'Enter' && this.addListItem('tempDislikes', 'addDislikeInput', () => this.renderSimpleList('dislikesList', this.tempDislikes)));

        this.dom.addPastEventBtn.addEventListener('click', () => this.openPastEventModal());
        this.dom.savePastEventModalBtn.addEventListener('click', () => this.savePastEventToTemp());
        this.dom.pastEventModal.querySelector('.cancel-modal').addEventListener('click', () => this.closePastEventModal());

        this.dom.addProgBtn.addEventListener('click', () => this.openProgressionPanel());
        this.dom.saveProgBtn.addEventListener('click', () => this.saveProgression());
        this.dom.deleteProgBtn.addEventListener('click', () => this.deleteProgression());
        this.dom.progExpandBtn.addEventListener('click', () => this.togglePanelExpand('progDetailPanel', 'progExpandIcon', 'progShrinkIcon'));

        this.dom.addForeshadowingBtn.addEventListener('click', () => this.openForeshadowingPanel());
        this.dom.saveForeshadowingBtn.addEventListener('click', () => this.saveForeshadowing());
        this.dom.deleteForeshadowingBtn.addEventListener('click', () => this.deleteForeshadowing());
        this.dom.foreshadowingExpandBtn.addEventListener('click', () => this.togglePanelExpand('foreshadowingDetailPanel', 'foreshadowingExpandIcon', 'foreshadowingShrinkIcon'));

        this.dom.addDictBtn.addEventListener('click', () => this.openDictionaryPanel());
        this.dom.saveDictBtn.addEventListener('click', () => this.saveDictionary());
        this.dom.deleteDictBtn.addEventListener('click', () => this.deleteDictionary());
        this.dom.dictExpandBtn.addEventListener('click', () => this.togglePanelExpand('dictDetailPanel', 'dictExpandIcon', 'dictShrinkIcon'));

        this.dom.saveRelBtn.addEventListener('click', () => this.saveRelationship());
        this.dom.deleteRelBtn.addEventListener('click', () => this.deleteRelationship());
        this.dom.relExpandBtn.addEventListener('click', () => this.togglePanelExpand('relDetailPanel', 'relExpandIcon', 'relShrinkIcon'));

        this.dom.editDictCategoryBtn.addEventListener('click', () => this.openCategoryModal());
        this.dom.closeDictCategoryModalBtn.addEventListener('click', () => this.closeCategoryModal());

        this.dom.saveDictCategoryBtn.addEventListener('click', () => this.handleCategorySave());



        this.dom.openGlobalBtn.addEventListener('click', () => this.openGlobalSettings());
        this.dom.saveGlobalBtn.addEventListener('click', () => this.saveGlobalSettings());
        this.dom.cancelGlobalBtn.addEventListener('click', () => this.closeGlobalSettings());
        this.dom.resetGlobalBtn.addEventListener('click', () => this.resetGlobalSettings());

        this.dom.settingsOpenBtn.addEventListener('click', () => this.openEditorSettings());
        this.dom.bgInput.addEventListener('input', () => this.updateEditorPreview('bgColor', this.dom.bgInput.value));
        this.dom.fontInput.addEventListener('input', () => this.updateEditorPreview('fontColor', this.dom.fontInput.value));
        this.dom.sizeRange.addEventListener('input', () => this.updateEditorPreview('fontSize', this.dom.sizeRange.value));
        this.dom.sizeNumber.addEventListener('change', () => this.handleFontSizeNumberChange());
        this.dom.familySelect.addEventListener('change', () => this.updateEditorPreview('fontFamily', this.dom.familySelect.value));
    }

    async run() {
        await StorageManager.init();
        await this.requestPersistentStorage();
        await this.renderProjectList();
        this.initTheme();
        UIHelper.showView('menu-view');
    }

    async requestPersistentStorage() {
        if (navigator.storage?.persist && !(await navigator.storage.persisted())) await navigator.storage.persist();
    }

    initTheme() {
        const t = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', t);
        this.updateThemeIcons(t);
    }

    toggleTheme() {
        const n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', n);
        localStorage.setItem('theme', n);
        this.updateThemeIcons(n);
    }

    updateThemeIcons(t) {
        this.dom.sunIcon.classList.toggle('hidden', t !== 'dark');
        this.dom.moonIcon.classList.toggle('hidden', t === 'dark');
    }

    switchTab(btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        const tabId = btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');

        if (tabId === 'tab-relations') {
            this.renderCurrentRelationshipMap();
        }
    }

    renderCurrentRelationshipMap(containerId = 'relationship-map-container') {
        const p = this.projects.find(x => x.id === this.currentProjectId);
        if (!p) return;

        renderRelationshipMap(
            containerId,
            p.characters || [],
            p.relationships || [],
            async (newChars, newRels) => {
                p.characters = newChars;
                p.relationships = newRels;
                await this.updateProjectInDB(p);
            },
            (rel, isNew) => this.openRelationshipPanel(rel, isNew)
        );
    }

    toggleRelMapFullscreen(isFullscreen) {
        if (isFullscreen) {
            this.dom.relMapFullscreenOverlay.classList.remove('hidden');
            // 오버레이가 보이고 나서 크기가 계산되도록 약간의 지연 시간을 둡니다.
            setTimeout(() => {
                this.renderCurrentRelationshipMap('relationship-map-fullscreen-container');
            }, 100);
        } else {
            this.dom.relMapFullscreenOverlay.classList.add('hidden');
            this.renderCurrentRelationshipMap('relationship-map-container');
        }
    }

    closeAllOverlappingUIs() {
        this.closeEditorSettings();
        this.closeProjectModal();
        this.closeGlobalSettings();
        this.closeCharacterPanel();
        this.closeProgressionPanel();
        this.closeForeshadowingPanel();
        this.closeDictionaryPanel();
        this.closeRelationshipPanel();
        this.closePastEventModal();
        this.closeCategoryModal();
        this.closeBackgroundEventModal();
    }

    async renderProjectList() {
        this.projects = await StorageManager.getAll(StorageManager.STORE_PROJECTS);
        this.dom.projectListUl.innerHTML = this.projects.length ? '' : '<li class="no-projects">프로젝트가 없습니다.</li>';
        this.projects.forEach(p => {
            const li = document.createElement('li');
            li.dataset.projectId = p.id;

            const thumbHTML = p.thumbnail ? '<img src="' + p.thumbnail + '" class="project-thumb">' : '<div class="project-thumb no-thumb"></div>';
            const tagsHTML = (p.tags || []).map(t => '<span class="tag-badge">#' + t + '</span>').join('');

            li.innerHTML = thumbHTML +
                '<div class="project-info">' +
                '<span class="project-title">' + p.name + '</span>' +
                '<span class="project-description">' + (p.description || '설명 없음') + '</span>' +
                '<div class="project-tags">' + tagsHTML + '</div>' +
                '</div>' +
                '<div class="project-menu-container">' +
                '<button class="kebab-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>' +
                '<div class="dropdown-menu">' +
                '<button class="dropdown-item edit">수정</button>' +
                '<button class="dropdown-item delete">삭제</button>' +
                '</div>' +
                '</div>';

            li.querySelector('.kebab-btn').onclick = (e) => { e.stopPropagation(); document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('visible')); li.querySelector('.dropdown-menu').classList.toggle('visible'); };
            li.querySelector('.edit').onclick = (e) => { e.stopPropagation(); this.openProjectModal(p); };
            li.querySelector('.delete').onclick = (e) => { e.stopPropagation(); this.handleDeleteProject(p.id); };
            li.onclick = () => this.selectProject(p.id);
            this.dom.projectListUl.appendChild(li);
        });
    }

    async handleDeleteProject(id) {
        if (confirm("삭제하시겠습니까?")) { await StorageManager.deleteProject(id); await this.renderProjectList(); }
    }

    openProjectModal(p = null) {
        this.editingProjectId = p?.id || null;
        this.dom.modalTitle.textContent = p ? "프로젝트 수정" : "새 프로젝트 생성";
        this.dom.modalCreateBtn.textContent = p ? "수정하기" : "생성하기";
        this.dom.newProjectTitle.value = p ? p.name : '';
        this.dom.newProjectDesc.value = p ? p.description : '';
        this.dom.newProjectTags.value = p ? (p.tags || []).join(', ') : '';
        this.dom.newProjectThumbnail.value = '';
        UIHelper.openModal(this.dom.createProjectModal, this.dom.overlay);
    }

    closeProjectModal() { UIHelper.closeModal(this.dom.createProjectModal, this.dom.overlay); }

    async handleProjectSubmit() {
        const title = this.dom.newProjectTitle.value.trim();
        if (!title) return alert("제목 필수");
        const tags = this.dom.newProjectTags.value.split(',').map(t => t.trim()).filter(t => t);
        const file = this.dom.newProjectThumbnail.files[0];
        let thumb = null;
        if (file) thumb = await new Promise(r => { const reader = new FileReader(); reader.onloadend = () => r(reader.result); reader.readAsDataURL(file); });

        if (this.editingProjectId) {
            const p = this.projects.find(x => x.id === this.editingProjectId);
            Object.assign(p, { name: title, description: this.dom.newProjectDesc.value.trim(), tags, thumbnail: thumb || p.thumbnail });
            await StorageManager.set(StorageManager.STORE_PROJECTS, p);
        } else {
            const id = Date.now().toString();
            const np = {
                id,
                name: title,
                description: this.dom.newProjectDesc.value.trim(),
                tags,
                thumbnail: thumb,
                creationDate: new Date().toISOString(),
                dictionaryCategories: ['장소', '아이템', '몬스터', '길드']
            };
            await StorageManager.set(StorageManager.STORE_PROJECTS, np);
            await StorageManager.set(StorageManager.STORE_SETTINGS, { bgColor: '#ffffff', fontColor: '#212529', fontSize: '16', fontFamily: "'Noto Serif CJK KR', serif" }, id);
        }
        await this.renderProjectList(); this.closeProjectModal();
    }

    async selectProject(id) {
        this.currentProjectId = id;
        const p = this.projects.find(x => x.id === id);
        if (!p) return;

        if (!p.dictionaryCategories) {
            p.dictionaryCategories = ['장소', '아이템', '몬스터', '길드'];
            await StorageManager.set(StorageManager.STORE_PROJECTS, p);
        }

        this.dom.detailTitle.textContent = p.name;
        this.dom.detailDescription.textContent = p.description || '설명 없음';
        this.renderDetailTags(p);
        const ns = p.novelSettings || {};
        ['Emotion', 'Gratification', 'Focus', 'Pov', 'Tone', 'Rules'].forEach(k => {
            const input = this.dom['proj' + k];
            if (input) input.value = ns[k.toLowerCase()] || '';
        });
        const bg = p.backgroundSettings || {};
        this.dom.projBgWorld.value = bg.world || '';

        if (bg.events && typeof bg.events === 'string') {
            p.backgroundSettings.events = [{
                name: '기존 사건 기록',
                detail: bg.events,
                time: '미지정',
                impact: ''
            }];
            await StorageManager.set(StorageManager.STORE_PROJECTS, p);
        }
        this.renderBackgroundEventsList();

        this.renderCharacterList(p.characters || []); this.closeCharacterPanel();
        this.renderProgressionList(p.progression || []); this.closeProgressionPanel();
        this.renderForeshadowingList(p.foreshadowing || []); this.closeForeshadowingPanel();
        this.renderDictionaryList(p.dictionary || []); this.closeDictionaryPanel();
        if (p.thumbnail) { this.dom.detailThumbnail.style.backgroundImage = 'url(' + p.thumbnail + ')'; this.dom.detailThumbnail.classList.remove('no-thumb'); }
        else { this.dom.detailThumbnail.style.backgroundImage = 'none'; this.dom.detailThumbnail.classList.add('no-thumb'); }
        this.switchTab(document.querySelector('.tab-btn[data-tab="tab-settings"]'));
        UIHelper.showView('project-detail-view');
        this.loadEditorSettings(id);
    }

    renderDetailTags(p) {
        this.dom.detailTagsContainer.innerHTML = '';
        (p.tags || []).forEach((t, i) => {
            const s = document.createElement('span'); s.className = 'tag-badge';
            s.innerHTML = '#' + t + ' <span class="remove-tag">&times;</span>';
            s.querySelector('.remove-tag').onclick = async () => { p.tags.splice(i, 1); await this.updateProjectInDB(p); this.renderDetailTags(p); };
            this.dom.detailTagsContainer.appendChild(s);
        });
    }

    async handleAddTag() {
        const p = this.projects.find(x => x.id === this.currentProjectId);
        const t = prompt("태그:"); if (t?.trim()) { if (!p.tags) p.tags = []; if (!p.tags.includes(t.trim())) { p.tags.push(t.trim()); await this.updateProjectInDB(p); this.renderDetailTags(p); } }
    }

    async saveProjectSettings() {
        const p = this.projects.find(x => x.id === this.currentProjectId);
        p.novelSettings = { emotion: this.dom.projEmotion.value.trim(), gratification: this.dom.projGratification.value.trim(), focus: this.dom.projFocus.value.trim(), pov: this.dom.projPov.value.trim(), tone: this.dom.projTone.value.trim(), rules: this.dom.projRules.value.trim() };
        await this.updateProjectInDB(p); alert("저장됨");
    }

    async saveBackgroundKnowledge() {
        const p = this.projects.find(x => x.id === this.currentProjectId);
        if (!p) return;
        if (!p.backgroundSettings) p.backgroundSettings = {};

        p.backgroundSettings.world = this.dom.projBgWorld.value.trim();

        await this.updateProjectInDB(p);
        alert("배경 지식이 저장되었습니다.");
    }

    renderBackgroundEventsList() {
        const p = this.projects.find(x => x.id === this.currentProjectId);
        if (!p) return;
        const events = p.backgroundSettings?.events || [];

        this.dom.projBgEventsList.innerHTML = events.length ? '' : '<div style="font-size:0.8rem;color:var(--text-secondary);text-align:center;padding:10px;">등록된 과거 사건이 없습니다.</div>';

        events.forEach((ev, i) => {
            const li = document.createElement('li');
            li.className = 'item-card';
            li.innerHTML =
                '<div class="drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div>' +
                '<div class="item-content">' +
                '<div class="item-name">' + ev.name + ' <span style="font-weight:normal;color:var(--text-secondary);font-size:0.9em;">(' + (ev.time || '시점 미지정') + ')</span></div>' +
                '<div class="item-meta">' + (ev.detail || '').substring(0, 50) + (ev.detail.length > 50 ? '...' : '') + '</div>' +
                '</div>' +
                '<button class="sub-item-delete">&times;</button>';

            li.addEventListener('click', (e) => {
                if (e.target.classList.contains('sub-item-delete') || e.target.closest('.sub-item-delete')) {
                } else if (e.target.classList.contains('drag-handle') || e.target.closest('.drag-handle')) {
                } else {
                    this.openBackgroundEventModal(i);
                }
            });

            li.querySelector('.sub-item-delete').addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm("'" + ev.name + "' 사건을 삭제하시겠습니까?")) {
                    p.backgroundSettings.events.splice(i, 1);
                    await this.updateProjectInDB(p);
                    this.renderBackgroundEventsList();
                }
            });

            ListModule.setupDragAndDrop(li, i, p.backgroundSettings.events, async (newList) => {
                p.backgroundSettings.events = newList;
                await StorageManager.set(StorageManager.STORE_PROJECTS, p);
                this.renderBackgroundEventsList();
            });

            this.dom.projBgEventsList.appendChild(li);
        });
    }

    openBackgroundEventModal(index = null) {
        this.currentEditingBgEventIndex = index;
        const p = this.projects.find(x => x.id === this.currentProjectId);
        const events = p.backgroundSettings?.events || [];
        const ev = index !== null ? events[index] : { time: '', name: '', detail: '', impact: '' };

        Object.keys(this.dom.projBgEventInputs).forEach(key => {
            this.dom.projBgEventInputs[key].value = ev[key] || '';
        });

        this.dom.saveProjBgEventModalBtn.textContent = index !== null ? '수정 완료' : '리스트에 추가';
        UIHelper.openModal(this.dom.projBgEventModal, this.dom.overlay);
    }

    closeBackgroundEventModal() {
        UIHelper.closeModal(this.dom.projBgEventModal, this.dom.overlay);
    }

    async saveBackgroundEvent() {
        const name = this.dom.projBgEventInputs.name.value.trim();
        if (!name) return alert("사건 이름은 필수입니다.");

        const p = this.projects.find(x => x.id === this.currentProjectId);
        if (!p.backgroundSettings) p.backgroundSettings = {};
        if (!p.backgroundSettings.events) p.backgroundSettings.events = [];

        const eventData = {};
        Object.keys(this.dom.projBgEventInputs).forEach(key => {
            eventData[key] = this.dom.projBgEventInputs[key].value.trim();
        });

        if (this.currentEditingBgEventIndex !== null) {
            p.backgroundSettings.events[this.currentEditingBgEventIndex] = eventData;
        } else {
            p.backgroundSettings.events.push(eventData);
        }

        await this.updateProjectInDB(p);
        this.renderBackgroundEventsList();
        this.closeBackgroundEventModal();
    }

    renderCharacterList(chars) {
        this.dom.charListUl.innerHTML = chars.length ? '' : '<li style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:40px;">등록된 등장인물이 없습니다.</li>';
        chars.forEach((c, i) => {
            const li = document.createElement('li');
            li.className = 'item-card' + (this.currentCharacterId === c.id ? ' active' : '');
            li.innerHTML = '<div class="drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div><div class="item-content"><div class="item-name">' + c.name + '</div><div class="item-meta">' + (c.role || '역할 미지정') + ' | ' + (c.race || '종족 미상') + '</div></div>';
            li.onclick = (e) => e.target.closest('.drag-handle') ? null : this.openCharacterPanel(c);
            ListModule.setupDragAndDrop(li, i, chars, (nl) => { const p = this.projects.find(x => x.id === this.currentProjectId); p.characters = nl; this.updateProjectInDB(p).then(() => this.renderCharacterList(nl)); });
            this.dom.charListUl.appendChild(li);
        });
    }

    openCharacterPanel(c = null) {
        this.currentCharacterId = c?.id || null;
        Object.keys(this.dom.charInputs).forEach(k => this.dom.charInputs[k].value = c?.[k] || '');
        this.tempPastEvents = c?.pastEvents ? [...c.pastEvents] : [];
        this.tempSpeechExamples = c?.speechExamples ? [...c.speechExamples] : [];

        const rawLikes = c?.likes || c?.tempLikes || c?.prefLikes;
        this.tempLikes = Array.isArray(rawLikes) ? [...rawLikes] : (typeof rawLikes === 'string' ? [rawLikes] : []);

        const rawDislikes = c?.dislikes || c?.tempDislikes || c?.prefDislikes;
        this.tempDislikes = Array.isArray(rawDislikes) ? [...rawDislikes] : (typeof rawDislikes === 'string' ? [rawDislikes] : []);

        this.dom.deleteCharBtn.style.display = c ? 'block' : 'none';
        this.renderPastEventsList();
        this.renderSpeechExamplesList();
        this.renderSimpleList('likesList', this.tempLikes);
        this.renderSimpleList('dislikesList', this.tempDislikes);

        this.dom.charDetailPanel.classList.remove('hidden');
        this.dom.charDetailPanel.querySelector('.form-container').scrollTop = 0;
        this.dom.themeToggle.classList.add('hidden');
        this.dom.panelCloseBtn?.classList.remove('hidden');
        this.dom.overlay.classList.add('visible');
        const p = this.projects.find(x => x.id === this.currentProjectId); if (p) this.renderCharacterList(p.characters || []);
    }

    closeCharacterPanel() {
        this.dom.charDetailPanel.classList.add('hidden'); this.dom.charDetailPanel.classList.remove('expanded');
        this.dom.expandIcon?.classList.remove('hidden'); this.dom.shrinkIcon?.classList.add('hidden');
        this.currentCharacterId = null;
        if (this.dom.settingsPanel.classList.contains('hidden') || !this.dom.settingsPanel.classList.contains('open')) {
            if (!this.dom.globalModal.classList.contains('visible')) {
                this.dom.overlay.classList.remove('visible');
                this.dom.themeToggle.classList.remove('hidden');
                this.dom.panelCloseBtn?.classList.add('hidden');
            }
        }
        const p = this.projects.find(x => x.id === this.currentProjectId); if (p) this.renderCharacterList(p.characters || []);
    }

    async saveCharacter() {
        const name = this.dom.charInputs.name.value.trim(); if (!name) return alert("이름 필수");
        const p = this.projects.find(x => x.id === this.currentProjectId); if (!p.characters) p.characters = [];
        const data = {
            id: this.currentCharacterId || Date.now().toString(),
            name,
            pastEvents: [...this.tempPastEvents],
            speechExamples: [...this.tempSpeechExamples],
            likes: [...this.tempLikes],
            dislikes: [...this.tempDislikes]
        };
        Object.keys(this.dom.charInputs).forEach(k => data[k] = this.dom.charInputs[k].value.trim());
        if (this.currentCharacterId) { const idx = p.characters.findIndex(x => x.id === this.currentCharacterId); p.characters[idx] = data; }
        else p.characters.push(data);
        await this.updateProjectInDB(p); this.closeCharacterPanel(); alert("저장됨");
    }

    async deleteCharacter() { if (confirm("삭제?")) { const p = this.projects.find(x => x.id === this.currentProjectId); p.characters = p.characters.filter(x => x.id !== this.currentCharacterId); await this.updateProjectInDB(p); this.closeCharacterPanel(); } }

    renderPastEventsList() {
        this.dom.pastEventsList.innerHTML = this.tempPastEvents.length ? '' : '<div style="font-size:0.8rem;color:var(--text-secondary);text-align:center;padding:10px;">등록된 과거 사건이 없습니다.</div>';
        this.tempPastEvents.forEach((ev, i) => {
            const d = document.createElement('div'); d.className = 'sub-item-card';
            d.innerHTML = '<div class="sub-item-title">' + ev.summary + '</div><div class="sub-item-desc">' + ev.detail + '</div><button class="sub-item-delete">&times;</button>';
            d.onclick = (e) => e.target.classList.contains('sub-item-delete') ? null : this.openPastEventModal(i);
            d.querySelector('.sub-item-delete').onclick = () => {
                const eventSummary = this.tempPastEvents[i].summary || '이름 없는 사건';
                if (confirm("'" + eventSummary + "' 사건을 삭제하시겠습니까?")) {
                    this.tempPastEvents.splice(i, 1);
                    this.renderPastEventsList();
                }
            };
            this.dom.pastEventsList.appendChild(d);
        });
    }

    openPastEventModal(idx = null) {
        this.currentEditingEventIdx = idx; const ev = idx !== null ? this.tempPastEvents[idx] : { summary: '', detail: '', impact: '' };
        this.dom.eventSummary.value = ev.summary; this.dom.eventDetail.value = ev.detail; this.dom.eventImpact.value = ev.impact;
        this.dom.savePastEventModalBtn.textContent = idx !== null ? '수정 완료' : '리스트에 추가';
        UIHelper.openModal(this.dom.pastEventModal, this.dom.overlay);
    }

    closePastEventModal() { UIHelper.closeModal(this.dom.pastEventModal, this.dom.overlay, () => !this.dom.charDetailPanel.classList.contains('hidden')); }

    savePastEventToTemp() {
        const s = this.dom.eventSummary.value.trim(); if (!s) return alert("요약 필수");
        const d = { summary: s, detail: this.dom.eventDetail.value.trim(), impact: this.dom.eventImpact.value.trim() };
        if (this.currentEditingEventIdx !== null) this.tempPastEvents[this.currentEditingEventIdx] = d; else this.tempPastEvents.push(d);
        this.renderPastEventsList(); this.closePastEventModal();
    }

    renderSpeechExamplesList() {
        this.dom.speechExamplesList.innerHTML = this.tempSpeechExamples.length ? '' : '<div style="font-size:0.8rem;color:var(--text-secondary);text-align:center;padding:10px;">등록된 대사 예시가 없습니다.</div>';
        this.tempSpeechExamples.forEach((s, i) => {
            const d = document.createElement('div'); d.className = 'speech-example-item';
            d.innerHTML = '<span>' + s + '</span><button class="item-delete-btn">&times;</button>';
            d.querySelector('.item-delete-btn').onclick = () => { this.tempSpeechExamples.splice(i, 1); this.renderSpeechExamplesList(); };
            this.dom.speechExamplesList.appendChild(d);
        });
    }

    addSpeechExample() { const v = this.dom.addSpeechInput.value.trim(); if (v) { this.tempSpeechExamples.push(v); this.dom.addSpeechInput.value = ''; this.renderSpeechExamplesList(); } }

    renderSimpleList(listKey, dataArray) {
        const container = this.dom[listKey];
        if (!container) return;
        container.innerHTML = dataArray.length ? '' : '<div style="font-size:0.8rem;color:var(--text-secondary);text-align:center;padding:10px;">등록된 항목이 없습니다.</div>';
        dataArray.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'speech-example-item';
            div.innerHTML = '<span>' + item + '</span><button class="item-delete-btn">&times;</button>';
            div.querySelector('.item-delete-btn').onclick = () => {
                dataArray.splice(i, 1);
                this.renderSimpleList(listKey, dataArray);
            };
            container.appendChild(div);
        });
    }

    addListItem(arrayKey, inputKey, renderFunc) {
        const input = this.dom[inputKey];
        const val = input.value.trim();
        if (val) {
            this[arrayKey].push(val);
            input.value = '';
            renderFunc();
        }
    }

    renderProgressionList(prog) {
        this.dom.progListUl.innerHTML = prog.length ? '' : '<li style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:40px;">등록된 전개 항목이 없습니다.</li>';
        prog.forEach((it, i) => {
            const li = document.createElement('li'); li.className = 'item-card' + (this.currentProgressionId === it.id ? ' active' : '');
            li.innerHTML = '<div class="drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div><div class="item-content"><div class="item-name">' + (i + 1) + '화</div><div class="item-meta">' + (it.summary ? it.summary.substring(0, 30) + (it.summary.length > 30 ? '...' : '') : '내용 없음') + '</div></div>';
            li.onclick = (e) => e.target.closest('.drag-handle') ? null : this.openProgressionPanel(it, i);
            ListModule.setupDragAndDrop(li, i, prog, (nl) => { const p = this.projects.find(x => x.id === this.currentProjectId); p.progression = nl; this.updateProjectInDB(p).then(() => this.renderProgressionList(nl)); });
            this.dom.progListUl.appendChild(li);
        });
    }

    openProgressionPanel(it = null, idx = null) {
        this.currentProgressionId = it?.id || null;
        if (it) { this.dom.progEpisodeDisplay.textContent = (idx + 1) + '화 (자동 배정)'; this.dom.progSummary.value = it.summary || ''; this.dom.progPoints.value = it.points || ''; this.dom.deleteProgBtn.style.display = 'block'; }
        else { const p = this.projects.find(x => x.id === this.currentProjectId); this.dom.progEpisodeDisplay.textContent = ((p.progression?.length || 0) + 1) + '화 (자동 배정)'; this.dom.progSummary.value = ''; this.dom.progPoints.value = ''; this.dom.deleteProgBtn.style.display = 'none'; }
        this.dom.progDetailPanel.classList.remove('hidden');
        this.dom.progDetailPanel.querySelector('.form-container').scrollTop = 0;
        this.dom.themeToggle.classList.add('hidden');
        this.dom.progCloseBtn?.classList.remove('hidden');
        this.dom.overlay.classList.add('visible');
        const p = this.projects.find(x => x.id === this.currentProjectId); if (p) this.renderProgressionList(p.progression || []);
    }

    closeProgressionPanel() {
        this.dom.progDetailPanel.classList.add('hidden'); this.dom.progDetailPanel.classList.remove('expanded');
        this.dom.progExpandIcon?.classList.remove('hidden'); this.dom.progShrinkIcon?.classList.add('hidden');
        this.currentProgressionId = null;
        if (this.dom.settingsPanel.classList.contains('hidden') || !this.dom.settingsPanel.classList.contains('open')) {
            if (!this.dom.globalModal.classList.contains('visible') && this.dom.charDetailPanel.classList.contains('hidden')) {
                this.dom.overlay.classList.remove('visible');
                this.dom.themeToggle.classList.remove('hidden');
                this.dom.progCloseBtn?.classList.add('hidden');
            }
        }
        const p = this.projects.find(x => x.id === this.currentProjectId); if (p) this.renderProgressionList(p.progression || []);
    }

    async saveProgression() {
        const p = this.projects.find(x => x.id === this.currentProjectId); if (!p.progression) p.progression = [];
        const d = { id: this.currentProgressionId || Date.now().toString(), summary: this.dom.progSummary.value.trim(), points: this.dom.progPoints.value.trim() };
        if (this.currentProgressionId) { const idx = p.progression.findIndex(x => x.id === this.currentProgressionId); p.progression[idx] = d; }
        else p.progression.push(d);
        await this.updateProjectInDB(p); this.closeProgressionPanel(); alert("저장됨");
    }

    async deleteProgression() { if (confirm("삭제?")) { const p = this.projects.find(x => x.id === this.currentProjectId); p.progression = p.progression.filter(x => x.id !== this.currentProgressionId); await this.updateProjectInDB(p); this.closeProgressionPanel(); } }

    renderForeshadowingList(foreshadowing) {
        this.dom.foreshadowingListUl.innerHTML = foreshadowing.length ? '' : '<li style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:40px;">등록된 떡밥이 없습니다.</li>';
        foreshadowing.forEach((it, i) => {
            const li = document.createElement('li');
            li.className = 'item-card' + (this.currentForeshadowingId === it.id ? ' active' : '');
            li.innerHTML = '<div class="drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div><div class="item-content"><div class="item-name">' + it.name + '</div><div class="item-meta">' + (it.hiddenFact ? it.hiddenFact.substring(0, 30) + (it.hiddenFact.length > 30 ? '...' : '') : '숨겨진 사실 없음') + '</div></div>';
            li.onclick = (e) => e.target.closest('.drag-handle') ? null : this.openForeshadowingPanel(it);
            ListModule.setupDragAndDrop(li, i, foreshadowing, (nl) => { const p = this.projects.find(x => x.id === this.currentProjectId); p.foreshadowing = nl; this.updateProjectInDB(p).then(() => this.renderForeshadowingList(nl)); });
            this.dom.foreshadowingListUl.appendChild(li);
        });
    }

    openForeshadowingPanel(it = null) {
        this.currentForeshadowingId = it?.id || null;
        Object.keys(this.dom.foreshadowingInputs).forEach(k => this.dom.foreshadowingInputs[k].value = it?.[k] || '');
        this.dom.deleteForeshadowingBtn.style.display = it ? 'block' : 'none';
        this.dom.foreshadowingDetailPanel.classList.remove('hidden');
        this.dom.foreshadowingDetailPanel.querySelector('.form-container').scrollTop = 0;
        this.dom.themeToggle.classList.add('hidden');
        this.dom.foreshadowingCloseBtn?.classList.remove('hidden');
        this.dom.overlay.classList.add('visible');
        const p = this.projects.find(x => x.id === this.currentProjectId);
        if (p) this.renderForeshadowingList(p.foreshadowing || []);
    }

    closeForeshadowingPanel() {
        this.dom.foreshadowingDetailPanel.classList.add('hidden');
        this.dom.foreshadowingDetailPanel.classList.remove('expanded');
        this.dom.foreshadowingExpandIcon?.classList.remove('hidden');
        this.dom.foreshadowingShrinkIcon?.classList.add('hidden');
        this.currentForeshadowingId = null;
        if (this.dom.settingsPanel.classList.contains('hidden') || !this.dom.settingsPanel.classList.contains('open')) {
            if (!this.dom.globalModal.classList.contains('visible') && this.dom.charDetailPanel.classList.contains('hidden') && this.dom.progDetailPanel.classList.contains('hidden') && this.dom.foreshadowingDetailPanel.classList.contains('hidden') && this.dom.dictDetailPanel.classList.contains('hidden')) {
                this.dom.overlay.classList.remove('visible');
                this.dom.themeToggle.classList.remove('hidden');
                this.dom.foreshadowingCloseBtn?.classList.add('hidden');
            }
        }
        const p = this.projects.find(x => x.id === this.currentProjectId);
        if (p) this.renderForeshadowingList(p.foreshadowing || []);
    }

    async saveForeshadowing() {
        const name = this.dom.foreshadowingInputs.name.value.trim();
        if (!name) return alert("명칭은 필수입니다.");
        const p = this.projects.find(x => x.id === this.currentProjectId);
        if (!p.foreshadowing) p.foreshadowing = [];
        const d = { id: this.currentForeshadowingId || Date.now().toString() };
        Object.keys(this.dom.foreshadowingInputs).forEach(k => d[k] = this.dom.foreshadowingInputs[k].value.trim());

        if (this.currentForeshadowingId) {
            const idx = p.foreshadowing.findIndex(x => x.id === this.currentForeshadowingId);
            p.foreshadowing[idx] = d;
        } else {
            p.foreshadowing.push(d);
        }
        await this.updateProjectInDB(p);
        this.closeForeshadowingPanel();
        alert("저장됨");
    }

    async deleteForeshadowing() {
        if (confirm("이 떡밥을 삭제하시겠습니까?")) {
            const p = this.projects.find(x => x.id === this.currentProjectId);
            p.foreshadowing = p.foreshadowing.filter(x => x.id !== this.currentForeshadowingId);
            await this.updateProjectInDB(p);
            this.closeForeshadowingPanel();
        }
    }

    renderDictionaryList(dict) {
        this.dom.dictListUl.innerHTML = dict.length ? '' : '<li style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:40px;">등록된 고유어 항목이 없습니다.</li>';
        dict.forEach((it, i) => {
            const li = document.createElement('li'); li.className = 'item-card' + (this.currentDictionaryId === it.id ? ' active' : '');
            li.innerHTML = '<div class="drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div><div class="item-content"><div class="item-name">' + it.name + '</div><div class="item-meta">' + (it.category || '미분류') + '</div></div>';
            li.onclick = (e) => e.target.closest('.drag-handle') ? null : this.openDictionaryPanel(it);
            ListModule.setupDragAndDrop(li, i, dict, (nl) => { const p = this.projects.find(x => x.id === this.currentProjectId); p.dictionary = nl; this.updateProjectInDB(p).then(() => this.renderDictionaryList(nl)); });
            this.dom.dictListUl.appendChild(li);
        });
    }

    openDictionaryPanel(it = null) {
        this.currentDictionaryId = it?.id || null;
        const p = this.projects.find(x => x.id === this.currentProjectId);
        const categorySelect = this.dom.dictInputs.category;
        const currentCategory = it?.category || (p.dictionaryCategories.length > 0 ? p.dictionaryCategories[0] : '');

        categorySelect.innerHTML = '';
        p.dictionaryCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
        categorySelect.value = currentCategory;

        this.dom.dictInputs.name.value = it?.name || '';
        this.dom.dictInputs.description.value = it?.description || '';

        this.dom.dictDetailPanel.classList.remove('hidden');
        this.dom.dictDetailPanel.querySelector('.form-container').scrollTop = 0;
        this.dom.themeToggle.classList.add('hidden');
        this.dom.dictCloseBtn?.classList.remove('hidden');
        this.dom.overlay.classList.add('visible');
        this.dom.deleteDictBtn.style.display = it ? 'block' : 'none';
        if (p) this.renderDictionaryList(p.dictionary || []);
    }

    closeDictionaryPanel() {
        this.dom.dictDetailPanel.classList.add('hidden'); this.dom.dictDetailPanel.classList.remove('expanded');
        this.dom.dictExpandIcon?.classList.remove('hidden'); this.dom.dictShrinkIcon?.classList.add('hidden');
        this.currentDictionaryId = null;
        if (this.dom.settingsPanel.classList.contains('hidden') || !this.dom.settingsPanel.classList.contains('open')) {
            if (!this.dom.globalModal.classList.contains('visible') && this.dom.charDetailPanel.classList.contains('hidden') && this.dom.progDetailPanel.classList.contains('hidden')) {
                this.dom.overlay.classList.remove('visible');
                this.dom.themeToggle.classList.remove('hidden');
                this.dom.dictCloseBtn?.classList.add('hidden');
            }
        }
        const p = this.projects.find(x => x.id === this.currentProjectId); if (p) this.renderDictionaryList(p.dictionary || []);
    }

    async saveDictionary() {
        const name = this.dom.dictInputs.name.value.trim(); if (!name) return alert("이름 필수");
        const p = this.projects.find(x => x.id === this.currentProjectId); if (!p.dictionary) p.dictionary = [];
        const d = { id: this.currentDictionaryId || Date.now().toString() };
        Object.keys(this.dom.dictInputs).forEach(k => d[k] = this.dom.dictInputs[k].value.trim());
        if (this.currentDictionaryId) { const idx = p.dictionary.findIndex(x => x.id === this.currentDictionaryId); p.dictionary[idx] = d; }
        else p.dictionary.push(d);
        await this.updateProjectInDB(p); this.closeDictionaryPanel(); alert("저장됨");
    }

    async deleteDictionary() { if (confirm("삭제?")) { const p = this.projects.find(x => x.id === this.currentProjectId); p.dictionary = p.dictionary.filter(x => x.id !== this.currentDictionaryId); await this.updateProjectInDB(p); this.closeDictionaryPanel(); } }

    openRelationshipPanel(rel, isNew = false) {
        this.currentRelationship = { ...rel };
        this.isNewRelationship = isNew;

        const p = this.projects.find(x => x.id === this.currentProjectId);
        const sourceChar = p.characters.find(c => c.id === rel.source);
        const targetChar = p.characters.find(c => c.id === rel.target);

        this.dom.relCharactersDisplay.textContent = (sourceChar?.name || '알 수 없음') + ' ↔ ' + (targetChar?.name || '알 수 없음');

        Object.keys(this.dom.relInputs).forEach(k => {
            this.dom.relInputs[k].value = rel[k] || '';
        });

        this.dom.relDetailPanel.classList.remove('hidden');
        this.dom.relDetailPanel.querySelector('.form-container').scrollTop = 0;
        this.dom.themeToggle.classList.add('hidden');
        this.dom.relCloseBtn?.classList.remove('hidden');
        this.dom.overlay.classList.add('visible');
        this.dom.deleteRelBtn.style.display = isNew ? 'none' : 'block';
    }

    closeRelationshipPanel() {
        this.dom.relDetailPanel.classList.add('hidden');
        this.dom.relDetailPanel.classList.remove('expanded');
        this.dom.relExpandIcon?.classList.remove('hidden');
        this.dom.relShrinkIcon?.classList.add('hidden');
        this.currentRelationship = null;
        if (this.dom.settingsPanel.classList.contains('hidden') || !this.dom.settingsPanel.classList.contains('open')) {
            if (!this.dom.globalModal.classList.contains('visible') && this.dom.charDetailPanel.classList.contains('hidden') && this.dom.progDetailPanel.classList.contains('hidden') && this.dom.dictDetailPanel.classList.contains('hidden')) {
                this.dom.overlay.classList.remove('visible');
                this.dom.themeToggle.classList.remove('hidden');
                this.dom.relCloseBtn?.classList.add('hidden');
            }
        }
    }

    async saveRelationship() {
        const label = this.dom.relInputs.label.value.trim();
        if (!label) return alert("관계 명칭은 필수입니다.");

        const p = this.projects.find(x => x.id === this.currentProjectId);
        if (!p.relationships) p.relationships = [];

        // DOM 요소(_element)가 포함되어 있을 수 있으므로 이를 제외하고 순수 데이터만 추출합니다.
        const { _element, ...pureData } = this.currentRelationship;
        const data = { ...pureData };
        
        Object.keys(this.dom.relInputs).forEach(k => {
            data[k] = this.dom.relInputs[k].value.trim();
        });

        if (this.isNewRelationship) {
            p.relationships.push(data);
        } else {
            const idx = p.relationships.findIndex(r => r.id === data.id);
            if (idx !== -1) {
                p.relationships[idx] = data;
            }
        }

        await this.updateProjectInDB(p);
        this.closeRelationshipPanel();

        // 현재 전체 화면 모드인지 확인하여 적절한 컨테이너에 다시 렌더링
        const isFullscreen = !this.dom.relMapFullscreenOverlay.classList.contains('hidden');
        this.renderCurrentRelationshipMap(isFullscreen ? 'relationship-map-fullscreen-container' : 'relationship-map-container');
        alert("저장되었습니다.");
    }

    async deleteRelationship() {
        if (confirm("이 관계를 삭제하시겠습니까?")) {
            const p = this.projects.find(x => x.id === this.currentProjectId);
            p.relationships = p.relationships.filter(r => r.id !== this.currentRelationship.id);
                    await this.updateProjectInDB(p);
                    this.closeRelationshipPanel();
                    
                    // 현재 전체 화면 모드인지 확인하여 적절한 컨테이너에 다시 렌더링
                    const isFullscreen = !this.dom.relMapFullscreenOverlay.classList.contains('hidden');
                    this.renderCurrentRelationshipMap(isFullscreen ? 'relationship-map-fullscreen-container' : 'relationship-map-container');
                }
            }
    openCategoryModal() {
        this.currentEditingCategoryIndex = null;
        this.dom.dictCategoryInput.value = '';
        this.dom.saveDictCategoryBtn.textContent = '추가';
        this.renderCategoryList();
        UIHelper.openModal(this.dom.dictCategoryModal, this.dom.overlay);
    }

    closeCategoryModal() {
        UIHelper.closeModal(this.dom.dictCategoryModal, this.dom.overlay);
    }

    renderCategoryList() {
        const p = this.projects.find(x => x.id === this.currentProjectId);
        if (!p) return;
        this.dom.dictCategoryList.innerHTML = '';
        p.dictionaryCategories.forEach((cat, index) => {
            const li = document.createElement('li');
            li.className = 'category-list-item';
            if (this.currentEditingCategoryIndex === index) {
                li.classList.add('selected');
            }
            li.innerHTML = '<span>' + cat + '</span>' +
                '<div class="category-item-buttons">' +
                '<button class="delete-cat-btn">삭제</button>' +
                '</div>';
            li.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-cat-btn')) {
                    this.handleCategoryDelete(index);
                } else {
                    this.handleCategorySelect(index);
                }
            });
            this.dom.dictCategoryList.appendChild(li);
        });
    }

    handleCategorySelect(index) {
        if (this.currentEditingCategoryIndex === index) {
            this.currentEditingCategoryIndex = null;
            this.dom.dictCategoryInput.value = '';
            this.dom.saveDictCategoryBtn.textContent = '추가';
        } else {
            const p = this.projects.find(x => x.id === this.currentProjectId);
            this.currentEditingCategoryIndex = index;
            this.dom.dictCategoryInput.value = p.dictionaryCategories[index];
            this.dom.saveDictCategoryBtn.textContent = '수정';
        }
        this.renderCategoryList();
    }

    async handleCategorySave() {
        const p = this.projects.find(x => x.id === this.currentProjectId);
        const newCategory = this.dom.dictCategoryInput.value.trim();
        if (!newCategory) return;

        const isDuplicate = p.dictionaryCategories.some((cat, index) => cat.toLowerCase() === newCategory.toLowerCase() && index !== this.currentEditingCategoryIndex);
        if (isDuplicate) {
            return alert('이미 존재하는 카테고리입니다.');
        }

        if (this.currentEditingCategoryIndex !== null) {
            const oldCategory = p.dictionaryCategories[this.currentEditingCategoryIndex];
            p.dictionaryCategories[this.currentEditingCategoryIndex] = newCategory;
            (p.dictionary || []).forEach(item => {
                if (item.category === oldCategory) {
                    item.category = newCategory;
                }
            });
        } else {
            p.dictionaryCategories.push(newCategory);
        }

        await this.updateProjectInDB(p);
        this.currentEditingCategoryIndex = null;
        this.dom.dictCategoryInput.value = '';
        this.dom.saveDictCategoryBtn.textContent = '추가';
        this.renderCategoryList();
        this.renderDictionaryList(p.dictionary || []);
    }

    async handleCategoryDelete(index) {
        const p = this.projects.find(x => x.id === this.currentProjectId);
        const categoryToDelete = p.dictionaryCategories[index];

        const isInUse = (p.dictionary || []).some(item => item.category === categoryToDelete);
        if (isInUse) {
            return alert('해당 카테고리를 사용하는 고유어가 있어 삭제할 수 없습니다.');
        }

        if (!confirm("'" + categoryToDelete + "' 카테고리를 삭제하시겠습니까?")) return;

        p.dictionaryCategories.splice(index, 1);
        await this.updateProjectInDB(p);

        if (this.currentEditingCategoryIndex === index) {
            this.currentEditingCategoryIndex = null;
            this.dom.dictCategoryInput.value = '';
            this.dom.saveDictCategoryBtn.textContent = '추가';
        }

        this.renderCategoryList();
    }


    togglePanelExpand(pk, ek, sk) { const p = this.dom[pk]; const isE = p.classList.toggle('expanded'); this.dom[ek].classList.toggle('hidden', isE); this.dom[sk].classList.toggle('hidden', !isE); }

    openGlobalSettings() {
        const d = { command: "WRITE_CHAPTER", instruction: "아래의 [설정값]과 [지금까지의 줄거리]를 완벽히 분석하여, [현재 챕터 범위]에 해당하는 소설 본문을 즉시 작성하시오.", output: "JSON 분석이나 사족(인사말)을 붙이지 말고...", role: "웹소설 전문 작가...", task: "소설 텍스트 생성", directives: "속도감 있는 전개..." };
        const s = { ...d, ...JSON.parse(localStorage.getItem('global_novel_prompt_settings') || '{}') };
        Object.keys(this.dom.globalInputs).forEach(k => this.dom.globalInputs[k].value = s[k] || '');
        UIHelper.openModal(this.dom.globalModal, this.dom.overlay); this.dom.themeToggle.classList.add('hidden');
    }

    closeGlobalSettings() { UIHelper.closeModal(this.dom.globalModal, this.dom.overlay); this.dom.themeToggle.classList.remove('hidden'); }

    saveGlobalSettings() { const ns = {}; Object.keys(this.dom.globalInputs).forEach(k => ns[k] = this.dom.globalInputs[k].value.trim()); localStorage.setItem('global_novel_prompt_settings', JSON.stringify(ns)); alert("저장됨"); this.closeGlobalSettings(); }

    resetGlobalSettings() {
        if (confirm("초기화하시겠습니까?")) {
            this.dom.globalInputs.command.value = "WRITE_CHAPTER";
            this.dom.globalInputs.instruction.value = "아래의 [설정값]과 [지금까지의 줄거리]를 완벽히 분석하여, [현재 챕터 범위]에 해당하는 소설 본문을 즉시 작성하시오.";
            this.dom.globalInputs.output.value = "JSON 분석이나 사족(인사말)을 붙이지 말고, 오직 소설 제목과 본문 텍스트만을 일반적인 텍스트로 출력할 것.";
            this.dom.globalInputs.role.value = "웹소설 전문 작가 (카카오페이지/네이버 시리즈 스타일)";
            this.dom.globalInputs.task.value = "소설 텍스트 생성";
            this.dom.globalInputs.directives.value = "속도감 있는 전개와 주인공의 압도적인 강함을 부각할 것. 결말은 열려 있으므로 현재 사건에 집중할 것.";
            alert("기본값으로 채워졌습니다. 저장 버튼을 눌러주세요.");
        }
    }

    async loadEditorSettings(pid) { const s = await StorageManager.get(StorageManager.STORE_SETTINGS, pid); this.currentSettings = s || { bgColor: '#ffffff', fontColor: '#212529', fontSize: '16', fontFamily: "'Noto Serif CJK KR', serif" }; this.applyEditorStyles(this.currentSettings); }

    applyEditorStyles(s) {
        const r = document.documentElement; r.style.setProperty('--editor-bg-color', s.bgColor); r.style.setProperty('--editor-font-color', s.fontColor); r.style.setProperty('--editor-font-size', s.fontSize + 'px'); r.style.setProperty('--editor-font-family', s.fontFamily);
        this.dom.bgInput.value = s.bgColor; this.dom.fontInput.value = s.fontColor; this.dom.sizeRange.value = s.fontSize; this.dom.sizeNumber.value = s.fontSize; this.dom.familySelect.value = s.fontFamily;
    }

    updateEditorPreview(k, v) { this.currentSettings[k] = v; this.applyEditorStyles(this.currentSettings); StorageManager.set(StorageManager.STORE_SETTINGS, this.currentSettings, this.currentProjectId); }

    handleFontSizeNumberChange() { let v = parseInt(this.dom.sizeNumber.value); v = Math.max(12, Math.min(100, v || 16)); this.updateEditorPreview('fontSize', v.toString()); }

    openEditorSettings() { this.dom.settingsPanel.classList.add('open'); this.dom.overlay.classList.add('visible'); this.dom.themeToggle.classList.add('hidden'); }

    closeEditorSettings() {
        this.dom.settingsPanel.classList.remove('open');
        if (this.dom.charDetailPanel.classList.contains('hidden') && this.dom.progDetailPanel.classList.contains('hidden') && this.dom.dictDetailPanel.classList.contains('hidden') && this.dom.relDetailPanel.classList.contains('hidden') && !this.dom.globalModal.classList.contains('visible')) {
            this.dom.overlay.classList.remove('visible');
            this.dom.themeToggle.classList.remove('hidden');
        }
    }
    async updateProjectInDB(project) {
        if (!project) return;

        // IndexedDB는 DOM 요소를 저장할 수 없으므로, 관계 데이터에서 _element 속성을 제거(정화)합니다.
        if (project.relationships && Array.isArray(project.relationships)) {
            project.relationships = project.relationships.map(rel => {
                const { _element, ...rest } = rel;
                return rest;
            });
        }

        const index = this.projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
            this.projects[index] = project;
        }
        await StorageManager.set(StorageManager.STORE_PROJECTS, project);
    }
}

// Bootstrap
const app = new NovelApp();
app.run();