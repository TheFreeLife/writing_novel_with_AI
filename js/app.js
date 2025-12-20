/**
 * js/app.js
 * 메인 애플리케이션 모듈
 */

import { StorageManager } from './storage.js';
import { UIHelper } from './ui-helper.js';
import { ListModule } from './list-module.js';

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
        this.currentDictionaryId = null;
        this.editingProjectId = null;
        this.currentEditingEventIdx = null;

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
            projBgEvents: document.getElementById('proj-bg-events'),
            saveProjBgBtn: document.getElementById('save-proj-bg-btn'),

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
            familySelect: document.getElementById('setting-font-family')
        };
    }

    bindEvents() {
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
        [this.dom.panelCloseBtn, this.dom.progCloseBtn, this.dom.dictCloseBtn, this.dom.settingsCloseBtnInner].forEach(btn => btn?.addEventListener('click', closeAll));

        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('visible'));
        });

        document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => this.switchTab(btn)));

        this.dom.addTagBtn.addEventListener('click', () => this.handleAddTag());
        this.dom.saveProjSettingsBtn.addEventListener('click', () => this.saveProjectSettings());
        this.dom.saveProjBgBtn.addEventListener('click', () => this.saveBackgroundKnowledge());

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

        this.dom.addDictBtn.addEventListener('click', () => this.openDictionaryPanel());
        this.dom.saveDictBtn.addEventListener('click', () => this.saveDictionary());
        this.dom.deleteDictBtn.addEventListener('click', () => this.deleteDictionary());
        this.dom.dictExpandBtn.addEventListener('click', () => this.togglePanelExpand('dictDetailPanel', 'dictExpandIcon', 'dictShrinkIcon'));

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
        document.getElementById(btn.dataset.tab).classList.add('active');
    }

    closeAllOverlappingUIs() {
        this.closeEditorSettings();
        this.closeProjectModal();
        this.closeGlobalSettings();
        this.closeCharacterPanel();
        this.closeProgressionPanel();
        this.closeDictionaryPanel();
        this.closePastEventModal();
    }

    async renderProjectList() {
        this.projects = await StorageManager.getAll(StorageManager.STORE_PROJECTS);
        this.dom.projectListUl.innerHTML = this.projects.length ? '' : '<li class="no-projects">프로젝트가 없습니다.</li>';
        this.projects.forEach(p => {
            const li = document.createElement('li');
            li.dataset.projectId = p.id;
            li.innerHTML = `
                ${p.thumbnail ? `<img src="${p.thumbnail}" class="project-thumb">` : `<div class="project-thumb no-thumb"></div>`}
                <div class="project-info">
                    <span class="project-title">${p.name}</span>
                    <span class="project-description">${p.description || '설명 없음'}</span>
                    <div class="project-tags">${(p.tags || []).map(t => `<span class="tag-badge">#${t}</span>`).join('')}</div>
                </div>
                <div class="project-menu-container">
                    <button class="kebab-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
                    <div class="dropdown-menu">
                        <button class="dropdown-item edit">수정</button>
                        <button class="dropdown-item delete">삭제</button>
                    </div>
                </div>`;
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
            const np = { id, name: title, description: this.dom.newProjectDesc.value.trim(), tags, thumbnail: thumb, creationDate: new Date().toISOString() };
            await StorageManager.set(StorageManager.STORE_PROJECTS, np);
            await StorageManager.set(StorageManager.STORE_SETTINGS, { bgColor: '#ffffff', fontColor: '#212529', fontSize: '16', fontFamily: "'Noto Serif CJK KR', serif" }, id);
        }
        await this.renderProjectList(); this.closeProjectModal();
    }

    async selectProject(id) {
        this.currentProjectId = id;
        const p = this.projects.find(x => x.id === id);
        if (!p) return;
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
        this.dom.projBgEvents.value = bg.events || '';
        this.renderCharacterList(p.characters || []); this.closeCharacterPanel();
        this.renderProgressionList(p.progression || []); this.closeProgressionPanel();
        this.renderDictionaryList(p.dictionary || []); this.closeDictionaryPanel();
        if (p.thumbnail) { this.dom.detailThumbnail.style.backgroundImage = `url(${p.thumbnail})`; this.dom.detailThumbnail.classList.remove('no-thumb'); }
        else { this.dom.detailThumbnail.style.backgroundImage = 'none'; this.dom.detailThumbnail.classList.add('no-thumb'); }
        this.switchTab(document.querySelector('.tab-btn[data-tab="tab-settings"]'));
        UIHelper.showView('project-detail-view');
        this.loadEditorSettings(id);
    }

    renderDetailTags(p) {
        this.dom.detailTagsContainer.innerHTML = '';
        (p.tags || []).forEach((t, i) => {
            const s = document.createElement('span'); s.className = 'tag-badge';
            s.innerHTML = `#${t} <span class="remove-tag">&times;</span>`;
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
        p.backgroundSettings = { world: this.dom.projBgWorld.value.trim(), events: this.dom.projBgEvents.value.trim() };
        await this.updateProjectInDB(p); alert("저장됨");
    }

    async updateProjectInDB(p) { await StorageManager.set(StorageManager.STORE_PROJECTS, p); await this.renderProjectList(); }

    renderCharacterList(chars) {
        this.dom.charListUl.innerHTML = chars.length ? '' : '<li style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:40px;">등록된 등장인물이 없습니다.</li>';
        chars.forEach((c, i) => {
            const li = document.createElement('li'); li.className = 'item-card' + (this.currentCharacterId === c.id ? ' active' : '');
            li.innerHTML = `<div class="drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div><div class="item-content"><div class="item-name">${c.name}</div><div class="item-meta">${c.role || '역할 미지정'} | ${c.race || '종족 미상'}</div></div>`;
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

        // Migration and initialization for Likes
        const rawLikes = c?.likes || c?.tempLikes || c?.prefLikes;
        this.tempLikes = Array.isArray(rawLikes) ? [...rawLikes] : (typeof rawLikes === 'string' ? [rawLikes] : []);

        // Migration and initialization for Dislikes
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
                this.dom.overlay.classList.remove('visible'); this.dom.themeToggle.classList.remove('hidden'); this.dom.panelCloseBtn?.classList.add('hidden');
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
            const d = document.createElement('div'); d.className = 'sub-item-card'; d.innerHTML = `<div class="sub-item-title">${ev.summary}</div><div class="sub-item-desc">${ev.detail}</div><button class="sub-item-delete">&times;</button>`;
            d.onclick = (e) => e.target.classList.contains('sub-item-delete') ? null : this.openPastEventModal(i);
            d.querySelector('.sub-item-delete').onclick = () => { this.tempPastEvents.splice(i, 1); this.renderPastEventsList(); };
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
            const d = document.createElement('div'); d.className = 'speech-example-item'; d.innerHTML = `<span>${s}</span><button class="item-delete-btn">&times;</button>`;
            d.querySelector('.item-delete-btn').onclick = () => { this.tempSpeechExamples.splice(i, 1); this.renderSpeechExamplesList(); };
            this.dom.speechExamplesList.appendChild(d);
        });
    }

    addSpeechExample() { const v = this.dom.addSpeechInput.value.trim(); if (v) { this.tempSpeechExamples.push(v); this.dom.addSpeechInput.value = ''; this.renderSpeechExamplesList(); } }

    renderSimpleList(listKey, dataArray) {
        const container = this.dom[listKey];
        if (!container) return;
        container.innerHTML = dataArray.length ? '' : `<div style="font-size:0.8rem;color:var(--text-secondary);text-align:center;padding:10px;">등록된 항목이 없습니다.</div>`;
        dataArray.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'speech-example-item';
            div.innerHTML = `<span>${item}</span><button class="item-delete-btn">&times;</button>`;
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
            li.innerHTML = `<div class="drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div><div class="item-content"><div class="item-name">${i + 1}화</div><div class="item-meta">${it.summary ? it.summary.substring(0, 30) + (it.summary.length > 30 ? '...' : '') : '내용 없음'}</div></div>`;
            li.onclick = (e) => e.target.closest('.drag-handle') ? null : this.openProgressionPanel(it, i);
            ListModule.setupDragAndDrop(li, i, prog, (nl) => { const p = this.projects.find(x => x.id === this.currentProjectId); p.progression = nl; this.updateProjectInDB(p).then(() => this.renderProgressionList(nl)); });
            this.dom.progListUl.appendChild(li);
        });
    }

    openProgressionPanel(it = null, idx = null) {
        this.currentProgressionId = it?.id || null;
        if (it) { this.dom.progEpisodeDisplay.textContent = `${idx + 1}화 (자동 배정)`; this.dom.progSummary.value = it.summary || ''; this.dom.progPoints.value = it.points || ''; this.dom.deleteProgBtn.style.display = 'block'; }
        else { const p = this.projects.find(x => x.id === this.currentProjectId); this.dom.progEpisodeDisplay.textContent = `${(p.progression?.length || 0) + 1}화 (자동 배정)`; this.dom.progSummary.value = ''; this.dom.progPoints.value = ''; this.dom.deleteProgBtn.style.display = 'none'; }
        this.dom.progDetailPanel.classList.remove('hidden'); this.dom.progDetailPanel.querySelector('.form-container').scrollTop = 0;
        this.dom.themeToggle.classList.add('hidden'); this.dom.progCloseBtn?.classList.remove('hidden'); this.dom.overlay.classList.add('visible');
        const p = this.projects.find(x => x.id === this.currentProjectId); if (p) this.renderProgressionList(p.progression || []);
    }

    closeProgressionPanel() {
        this.dom.progDetailPanel.classList.add('hidden'); this.dom.progDetailPanel.classList.remove('expanded');
        this.dom.progExpandIcon?.classList.remove('hidden'); this.dom.progShrinkIcon?.classList.add('hidden');
        this.currentProgressionId = null;
        if (this.dom.settingsPanel.classList.contains('hidden') || !this.dom.settingsPanel.classList.contains('open')) {
            if (!this.dom.globalModal.classList.contains('visible') && this.dom.charDetailPanel.classList.contains('hidden')) {
                this.dom.overlay.classList.remove('visible'); this.dom.themeToggle.classList.remove('hidden'); this.dom.progCloseBtn?.classList.add('hidden');
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

    renderDictionaryList(dict) {
        this.dom.dictListUl.innerHTML = dict.length ? '' : '<li style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:40px;">등록된 고유어 항목이 없습니다.</li>';
        dict.forEach((it, i) => {
            const li = document.createElement('li'); li.className = 'item-card' + (this.currentDictionaryId === it.id ? ' active' : '');
            li.innerHTML = `<div class="drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div><div class="item-content"><div class="item-name">${it.name}</div><div class="item-meta">${it.category || '미분류'}</div></div>`;
            li.onclick = (e) => e.target.closest('.drag-handle') ? null : this.openDictionaryPanel(it);
            ListModule.setupDragAndDrop(li, i, dict, (nl) => { const p = this.projects.find(x => x.id === this.currentProjectId); p.dictionary = nl; this.updateProjectInDB(p).then(() => this.renderDictionaryList(nl)); });
            this.dom.dictListUl.appendChild(li);
        });
    }

    openDictionaryPanel(it = null) {
        this.currentDictionaryId = it?.id || null;
        Object.keys(this.dom.dictInputs).forEach(k => this.dom.dictInputs[k].value = it?.[k] || (k === 'category' ? '장소' : ''));
        this.dom.dictDetailPanel.classList.remove('hidden'); this.dom.dictDetailPanel.querySelector('.form-container').scrollTop = 0;
        this.dom.themeToggle.classList.add('hidden'); this.dom.dictCloseBtn?.classList.remove('hidden'); this.dom.overlay.classList.add('visible');
        this.dom.deleteDictBtn.style.display = it ? 'block' : 'none';
        const p = this.projects.find(x => x.id === this.currentProjectId); if (p) this.renderDictionaryList(p.dictionary || []);
    }

    closeDictionaryPanel() {
        this.dom.dictDetailPanel.classList.add('hidden'); this.dom.dictDetailPanel.classList.remove('expanded');
        this.dom.dictExpandIcon?.classList.remove('hidden'); this.dom.dictShrinkIcon?.classList.add('hidden');
        this.currentDictionaryId = null;
        if (this.dom.settingsPanel.classList.contains('hidden') || !this.dom.settingsPanel.classList.contains('open')) {
            if (!this.dom.globalModal.classList.contains('visible') && this.dom.charDetailPanel.classList.contains('hidden') && this.dom.progDetailPanel.classList.contains('hidden')) {
                this.dom.overlay.classList.remove('visible'); this.dom.themeToggle.classList.remove('hidden'); this.dom.dictCloseBtn?.classList.add('hidden');
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

    togglePanelExpand(pk, ek, sk) { const p = this.dom[pk]; const isE = p.classList.toggle('expanded'); this.dom[ek].classList.toggle('hidden', isE); this.dom[sk].classList.toggle('hidden', !isE); }

    openGlobalSettings() {
        const d = { command: "WRITE_CHAPTER", instruction: "아래의 [설정값]과 [지금까지의 줄거리]를 완벽히 분석하여, [현재 챕터 범위]에 해당하는 소설 본문을 즉시 작성하시오.", output: "JSON 분석이나 사족(인사말)을 붙이지 말고...", role: "웹소설 전문 작가...", task: "소설 텍스트 생성", directives: "속도감 있는 전개..." };
        const s = { ...d, ...JSON.parse(localStorage.getItem('global_novel_prompt_settings') || '{}') };
        Object.keys(this.dom.globalInputs).forEach(k => this.dom.globalInputs[k].value = s[k] || '');
        UIHelper.openModal(this.dom.globalModal, this.dom.overlay); this.dom.themeToggle.classList.add('hidden'); this.dom.panelCloseBtn?.classList.remove('hidden');
    }

    closeGlobalSettings() { UIHelper.closeModal(this.dom.globalModal, this.dom.overlay); this.dom.themeToggle.classList.remove('hidden'); this.dom.panelCloseBtn?.classList.add('hidden'); }

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
        const r = document.documentElement; r.style.setProperty('--editor-bg-color', s.bgColor); r.style.setProperty('--editor-font-color', s.fontColor); r.style.setProperty('--editor-font-size', `${s.fontSize}px`); r.style.setProperty('--editor-font-family', s.fontFamily);
        this.dom.bgInput.value = s.bgColor; this.dom.fontInput.value = s.fontColor; this.dom.sizeRange.value = s.fontSize; this.dom.sizeNumber.value = s.fontSize; this.dom.familySelect.value = s.fontFamily;
    }

    updateEditorPreview(k, v) { this.currentSettings[k] = v; this.applyEditorStyles(this.currentSettings); StorageManager.set(StorageManager.STORE_SETTINGS, this.currentSettings, this.currentProjectId); }

    handleFontSizeNumberChange() { let v = parseInt(this.dom.sizeNumber.value); v = Math.max(12, Math.min(100, v || 16)); this.updateEditorPreview('fontSize', v.toString()); }

    openEditorSettings() { this.dom.settingsPanel.classList.add('open'); this.dom.overlay.classList.add('visible'); this.dom.themeToggle.classList.add('hidden'); this.dom.panelCloseBtn?.classList.remove('hidden'); }

    closeEditorSettings() {
        this.dom.settingsPanel.classList.remove('open');
        if (this.dom.charDetailPanel.classList.contains('hidden') && this.dom.progDetailPanel.classList.contains('hidden') && this.dom.dictDetailPanel.classList.contains('hidden') && !this.dom.globalModal.classList.contains('visible')) {
            this.dom.overlay.classList.remove('visible'); this.dom.themeToggle.classList.remove('hidden'); this.dom.panelCloseBtn?.classList.add('hidden');
        }
    }
}

// Bootstrap
const app = new NovelApp();
app.run();
