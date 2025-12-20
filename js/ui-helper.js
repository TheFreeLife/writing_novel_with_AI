/**
 * js/ui-helper.js
 * UI 제어 및 뷰 전환 유틸리티 모듈
 */

export class UIHelper {
    static showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            if (view.id === viewId) {
                view.classList.remove('hidden');
                view.style.zIndex = '10';
            } else {
                view.classList.add('hidden');
                view.style.zIndex = '1';
            }
        });
    }

    static openModal(modal, overlay) {
        if (!modal) return;
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('visible');
            overlay.classList.add('visible');
        });
    }

    static closeModal(modal, overlay, otherCheckingFunc = null) {
        if (!modal) return;
        modal.classList.remove('visible');

        const shouldKeepOverlay = otherCheckingFunc ? otherCheckingFunc() : false;
        if (!shouldKeepOverlay) {
            overlay.classList.remove('visible');
        }

        setTimeout(() => {
            if (!modal.classList.contains('visible')) {
                modal.style.display = 'none';
            }
        }, 300);
    }
}
