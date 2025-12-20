/**
 * js/list-module.js
 * 리스트 아이템 및 드래그 앤 드롭 관리 모듈
 */

export class ListModule {
    static setupDragAndDrop(li, index, list, onUpdate) {
        li.draggable = true;

        li.addEventListener('mousedown', (e) => {
            li.draggable = !!e.target.closest('.drag-handle');
        });

        li.addEventListener('dragstart', (e) => {
            li.classList.add('dragging');
            e.dataTransfer.setData('text/plain', index);
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            document.querySelectorAll('.item-card').forEach(card => {
                card.classList.remove('drag-over-top', 'drag-over-bottom');
            });
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.item-card.dragging');
            if (draggingItem && draggingItem !== li) {
                const rect = li.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                if (e.clientY < midpoint) {
                    li.classList.add('drag-over-top');
                    li.classList.remove('drag-over-bottom');
                } else {
                    li.classList.add('drag-over-bottom');
                    li.classList.remove('drag-over-top');
                }
            }
        });

        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over-top', 'drag-over-bottom');
        });

        li.addEventListener('drop', async (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            let toIndex = index;
            if (li.classList.contains('drag-over-bottom')) toIndex = index + 1;

            if (fromIndex === toIndex || fromIndex === toIndex - 1) return;

            const movedItem = list.splice(fromIndex, 1)[0];
            const adjustToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
            list.splice(adjustToIndex, 0, movedItem);

            onUpdate(list);
        });
    }
}
