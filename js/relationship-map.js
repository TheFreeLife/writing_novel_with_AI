export function renderRelationshipMap(containerId, characters = [], relationships = [], onSave, onEditRelationship) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container with id ' + containerId + ' not found.');
        return;
    }
    container.innerHTML = ''; // Clear previous content

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    if (width === 0 || height === 0) return;

    // 만약 데이터가 없다면 렌더링 중단
    if (!characters || characters.length === 0) {
        container.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:var(--text-secondary);">등록된 인물이 없습니다.</div>';
        return;
    }

    // --- Data Initialization (Positions) ---
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 * 0.7;

    // 중심 노드 결정 (isCenter 속성이 없으면 첫 번째 노드를 중심으로)
    // 위치 정보가 없는 경우에만 초기 레이아웃 계산
    const needsLayout = characters.some(c => c.x === undefined || c.y === undefined);

    if (needsLayout) {
        const centerChar = characters.find(c => c.isCenter) || characters[0];
        const peripheralChars = characters.filter(c => c.id !== centerChar.id);

        characters.forEach((char) => {
            if (char.x !== undefined && char.y !== undefined) return; // 이미 위치가 있으면 유지

            if (char.id === centerChar.id) {
                char.x = centerX;
                char.y = centerY;
            } else {
                const charIndex = peripheralChars.findIndex(c => c.id === char.id);
                const angle = (2 * Math.PI / peripheralChars.length) * charIndex - (Math.PI / 2);
                char.x = centerX + radius * Math.cos(angle);
                char.y = centerY + radius * Math.sin(angle);
            }
        });
        // 초기 레이아웃 저장
        if (onSave) {
            const sanitizedRels = relationships.map(r => {
                const { _element, ...rest } = r;
                return rest;
            });
            onSave(characters, sanitizedRels);
        }
    }

    // --- SVG Setup ---
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.classList.add('relationship-svg');
    container.appendChild(svg);

    // Marker definition for arrows (optional, but good for directed graphs)
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // --- Groups for layering ---
    const linesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(linesGroup);
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(nodesGroup);
    const tempLineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(tempLineGroup);

    // --- Pan and Zoom State ---
    let viewBox = { x: 0, y: 0, w: width, h: height };
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // --- State Variables ---
    let isPanning = false;
    let panStart = { x: 0, y: 0 };

    let draggingNodeId = null;
    let isNodeDragging = false;

    let isCreatingRel = false;
    let relSourceNodeId = null;
    let tempLine = null;

    const nodeElements = {}; // Map id -> { g, x, y, ... }

    // --- Helper: Coordinate Conversion ---
    const getSVGPoint = (clientX, clientY) => {
        const CTM = svg.getScreenCTM();
        const point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        return point.matrixTransform(CTM.inverse());
    };

    const updateViewBox = () => {
        svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    };

    // --- Helper: Context Menu ---
    const removeContextMenu = () => {
        const existing = document.getElementById('rel-context-menu');
        if (existing) existing.remove();
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('#rel-context-menu')) return;
        removeContextMenu();
    });

    // --- Global Event Handler for SVG Context Menu ---
    svg.addEventListener('contextmenu', (e) => e.preventDefault());

    // --- Rendering Functions ---
    const drawLine = (rel) => {
        const sourceChar = characters.find(c => c.id === rel.source);
        const targetChar = characters.find(c => c.id === rel.target);
        if (!sourceChar || !targetChar) return;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.dataset.relId = rel.id || `${rel.source}-${rel.target}`;

        // Context Menu for Relationship
        g.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeContextMenu();

            const menu = document.createElement('div');
            menu.id = 'rel-context-menu';
            menu.className = 'dropdown-menu visible';
            menu.style.position = 'fixed';
            menu.style.left = e.clientX + 'px';
            menu.style.top = e.clientY + 'px';
            menu.style.zIndex = '3000';

            const editBtn = document.createElement('button');
            editBtn.className = 'dropdown-item';
            editBtn.textContent = '수정';
            editBtn.onclick = () => {
                removeContextMenu();
                if (onEditRelationship) {
                    onEditRelationship(rel, false);
                } else {
                    const newLabel = prompt("새로운 관계 명칭:", rel.label);
                    if (newLabel !== null) {
                        rel.label = newLabel || '관계';

                        // DOM 업데이트
                        if (rel._element) {
                            rel._element.text.textContent = rel.label;
                            const textLen = rel.label.length * 12; // Approximation
                            const lx = parseFloat(rel._element.text.getAttribute('x'));
                            rel._element.rect.setAttribute('x', lx - textLen / 2 - 5);
                            rel._element.rect.setAttribute('width', textLen + 10);
                        }

                        if (onSave) {
                            const sanitizedRels = relationships.map(r => {
                                const { _element, ...rest } = r;
                                return rest;
                            });
                            onSave(characters, sanitizedRels);
                        }
                    }
                }
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'dropdown-item delete';
            deleteBtn.textContent = '삭제';
            deleteBtn.onclick = () => {
                removeContextMenu();
                if (confirm("관계 선을 삭제하시겠습니까?")) {
                    const idx = relationships.indexOf(rel);
                    if (idx > -1) {
                        relationships.splice(idx, 1);
                        if (rel._element && rel._element.g) rel._element.g.remove();
                        if (onSave) {
                            const sanitizedRels = relationships.map(r => {
                                const { _element, ...rest } = r;
                                return rest;
                            });
                            onSave(characters, sanitizedRels);
                        }
                    }
                }
            };

            menu.appendChild(editBtn);
            menu.appendChild(deleteBtn);
            document.body.appendChild(menu);
        });

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourceChar.x);
        line.setAttribute('y1', sourceChar.y);
        line.setAttribute('x2', targetChar.x);
        line.setAttribute('y2', targetChar.y);
        line.classList.add('relationship-line');
        g.appendChild(line);

        const labelX = (sourceChar.x + targetChar.x) / 2;
        const labelY = (sourceChar.y + targetChar.y) / 2;

        const labelG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        labelG.style.cursor = 'pointer';
        g.appendChild(labelG);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.textContent = rel.label || '관계';
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '0.3em');
        text.classList.add('relationship-label');

        // Style text directly (Clean style: Halo + Color)
        text.style.paintOrder = 'stroke';
        text.style.stroke = 'var(--bg-color)';
        text.style.strokeWidth = '4px';
        text.style.strokeLinecap = 'round';
        text.style.strokeLinejoin = 'round';
        text.style.fontSize = '0.9em';
        text.style.fill = 'var(--text-secondary)';
        text.style.transition = 'font-weight 0.1s, fill 0.1s';

        // Background for text (Invisible Hit Area)
        const textLen = (rel.label || '관계').length * 12;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', labelX - textLen / 2 - 10); // Slightly larger hit area
        rect.setAttribute('y', labelY - 15);
        rect.setAttribute('width', textLen + 20);
        rect.setAttribute('height', 30);
        rect.setAttribute('fill', 'transparent'); // Invisible

        // Hover Effect
        labelG.addEventListener('mouseenter', () => {
            text.style.fontWeight = 'bold';
            text.style.fill = 'var(--primary-color)';
        });

        labelG.addEventListener('mouseleave', () => {
            text.style.fontWeight = 'normal';
            text.style.fill = 'var(--text-secondary)';
        });

        labelG.appendChild(rect);
        labelG.appendChild(text);

        linesGroup.appendChild(g);

        // Store reference for updating
        rel._element = { line, text, rect, g };
    };

    const drawNode = (char) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${char.x},${char.y})`);
        g.classList.add('node');
        g.dataset.id = char.id;
        g.style.cursor = 'grab';

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '45');
        circle.classList.add('node-circle');
        if (char.isCenter) circle.classList.add('center-node');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.textContent = char.name;
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '0.3em');
        text.classList.add('node-label');
        // prevent text selection
        text.style.userSelect = 'none';

        g.appendChild(circle);
        g.appendChild(text);
        nodesGroup.appendChild(g);

        nodeElements[char.id] = g;

        // Node Event Listeners
        g.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            if (e.button === 0) {
                // Left Click -> Move
                isNodeDragging = true;
                draggingNodeId = char.id;
                g.style.cursor = 'grabbing';
            } else if (e.button === 2) {
                // Right Click -> Create Relationship
                isCreatingRel = true;
                relSourceNodeId = char.id;

                // Create temp line
                tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                tempLine.setAttribute('x1', char.x);
                tempLine.setAttribute('y1', char.y);
                tempLine.setAttribute('x2', char.x);
                tempLine.setAttribute('y2', char.y);
                tempLine.classList.add('relationship-line');
                tempLine.style.strokeDasharray = '5,5';
                tempLine.style.pointerEvents = 'none';
                tempLineGroup.appendChild(tempLine);
            }
        });

        g.addEventListener('contextmenu', (e) => e.preventDefault());
    };

    // --- Initial Draw ---
    relationships.forEach(drawLine);
    characters.forEach(drawNode);

    // --- Global Event Handlers (on SVG) ---
    svg.addEventListener('mousedown', (e) => {
        if (e.button === 0 && !e.target.closest('.node')) {
            isPanning = true;
            panStart = { x: e.clientX, y: e.clientY };
            svg.style.cursor = 'grabbing';
        }
    });

    svg.addEventListener('mousemove', (e) => {
        if (isPanning) {
            e.preventDefault();
            const dx = (panStart.x - e.clientX) * (viewBox.w / width); // Client diff -> SVG units
            const dy = (panStart.y - e.clientY) * (viewBox.h / height);
            viewBox.x += dx;
            viewBox.y += dy;
            updateViewBox();
            panStart = { x: e.clientX, y: e.clientY };
        } else if (isNodeDragging && draggingNodeId) {
            e.preventDefault();
            const pt = getSVGPoint(e.clientX, e.clientY);
            const char = characters.find(c => c.id === draggingNodeId);
            if (char) {
                char.x = pt.x;
                char.y = pt.y;

                // Update Node DOM
                const nodeEl = nodeElements[draggingNodeId];
                nodeEl.setAttribute('transform', `translate(${char.x},${char.y})`);

                // Update connected lines
                relationships.forEach(rel => {
                    if ((rel.source === draggingNodeId || rel.target === draggingNodeId) && rel._element) {
                        const source = characters.find(c => c.id === rel.source);
                        const target = characters.find(c => c.id === rel.target);
                        if (source && target) {
                            rel._element.line.setAttribute('x1', source.x);
                            rel._element.line.setAttribute('y1', source.y);
                            rel._element.line.setAttribute('x2', target.x);
                            rel._element.line.setAttribute('y2', target.y);

                            const lx = (source.x + target.x) / 2;
                            const ly = (source.y + target.y) / 2;
                            rel._element.text.setAttribute('x', lx);
                            rel._element.text.setAttribute('y', ly);

                            const textLen = (rel.label || '관계').length * 12;
                            rel._element.rect.setAttribute('x', lx - textLen / 2 - 5);
                            rel._element.rect.setAttribute('y', ly - 10);
                        }
                    }
                });
            }
        } else if (isCreatingRel && tempLine) {
            e.preventDefault();
            const pt = getSVGPoint(e.clientX, e.clientY);
            tempLine.setAttribute('x2', pt.x);
            tempLine.setAttribute('y2', pt.y);
        }
    });

    svg.addEventListener('mouseup', (e) => {
        if (isPanning) {
            isPanning = false;
            svg.style.cursor = 'grab';
        }

        if (isNodeDragging) {
            isNodeDragging = false;
            const nodeEl = nodeElements[draggingNodeId];
            if (nodeEl) nodeEl.style.cursor = 'grab';
            draggingNodeId = null;
            if (onSave) {
                // _element 속성 제거 후 저장 (Clone 에러 방지)
                const sanitizedRels = relationships.map(r => {
                    const { _element, ...rest } = r;
                    return rest;
                });
                onSave(characters, sanitizedRels);
            }
        }

        if (isCreatingRel) {
            isCreatingRel = false;
            if (tempLine) {
                tempLine.remove();
                tempLine = null;
            }

            // Check if dropped on a node
            const targetNodeEl = e.target.closest('.node');
            if (targetNodeEl) {
                const targetId = targetNodeEl.dataset.id;
                if (targetId && targetId !== relSourceNodeId) {
                    // Check if exists
                    const exists = relationships.some(r =>
                        (r.source === relSourceNodeId && r.target === targetId) ||
                        (r.source === targetId && r.target === relSourceNodeId)
                    );

                    if (!exists) {
                        if (onEditRelationship) {
                            const newRel = {
                                id: Date.now().toString(),
                                source: relSourceNodeId,
                                target: targetId,
                                label: '관계'
                            };
                            onEditRelationship(newRel, true);
                        } else {
                            const label = prompt("관계 명칭을 입력하세요:", "관계");
                            if (label) {
                                const newRel = {
                                    id: Date.now().toString(),
                                    source: relSourceNodeId,
                                    target: targetId,
                                    label: label
                                };
                                relationships.push(newRel);
                                drawLine(newRel);
                                if (onSave) {
                                    const sanitizedRels = relationships.map(r => {
                                        const { _element, ...rest } = r;
                                        return rest;
                                    });
                                    onSave(characters, sanitizedRels);
                                }
                            }
                        }
                    } else {
                        alert("이미 존재하는 관계입니다.");
                    }
                }
            }
            relSourceNodeId = null;
        }
    });

    svg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = 0.07;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoomIntensity = 1 + wheel * zoomFactor;

        // Current mouse position in SVG coords
        const pt = getSVGPoint(e.clientX, e.clientY);

        const newW = viewBox.w / zoomIntensity;
        const newH = viewBox.h / zoomIntensity;

        // Scale around mouse point
        viewBox.x = pt.x - (pt.x - viewBox.x) / zoomIntensity;
        viewBox.y = pt.y - (pt.y - viewBox.y) / zoomIntensity;
        viewBox.w = newW;
        viewBox.h = newH;

        updateViewBox();
    });

    // Handle mouse leaving window while dragging
    svg.addEventListener('mouseleave', () => {
        isPanning = false;
        isNodeDragging = false;
        if (isCreatingRel) {
            isCreatingRel = false;
            if (tempLine) { tempLine.remove(); tempLine = null; }
        }
    });
}
