const characterData = {
    characters: [
        { id: 'center', name: '나', isCenter: true },
        { id: 'char1', name: '친구 A' },
        { id: 'char2', name: '가족 B' },
        { id: 'char3', name: '동료 C' },
        { id: 'char4', name: '라이벌 D' },
        { id: 'char5', name: '스승 E' },
    ],
    relationships: [
        { source: 'center', target: 'char1', label: '우정' },
        { source: 'center', target: 'char2', label: '혈연' },
        { source: 'center', target: 'char3', label: '협력' },
        { source: 'center', target: 'char4', label: '경쟁' },
        { source: 'center', target: 'char5', label: '사제' },
    ]
};

export function renderRelationshipMap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container with id ' + containerId + ' not found.');
        return;
    }
    container.innerHTML = ''; // Clear previous content

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    
    if (width === 0 || height === 0) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.classList.add('relationship-svg');
    
    container.appendChild(svg);

    // --- Pan and Zoom State ---
    let viewBox = { x: 0, y: 0, w: width, h: height };
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.style.cursor = 'grab';

    let isPanning = false;
    let startPoint = { x: 0, y: 0 };

    const updateViewBox = () => {
        svg.setAttribute('viewBox', viewBox.x + ' ' + viewBox.y + ' ' + viewBox.w + ' ' + viewBox.h);
    };

    // --- Event Handlers ---
    svg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = 0.07;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoomIntensity = 1 + wheel * zoomFactor;

        const CTM = svg.getScreenCTM();
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const svgPoint = point.matrixTransform(CTM.inverse());

        const newWidth = viewBox.w / zoomIntensity;
        const newHeight = viewBox.h / zoomIntensity;

        viewBox.x = svgPoint.x - (svgPoint.x - viewBox.x) / zoomIntensity;
        viewBox.y = svgPoint.y - (svgPoint.y - viewBox.y) / zoomIntensity;
        viewBox.w = newWidth;
        viewBox.h = newHeight;
        
        updateViewBox();
    });

    svg.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || e.target.closest('.node')) return;
        e.preventDefault();
        isPanning = true;
        startPoint = { x: e.clientX, y: e.clientY };
        svg.style.cursor = 'grabbing';
    });

    svg.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        e.preventDefault();
        
        const endPoint = { x: e.clientX, y: e.clientY };
        const dx = (startPoint.x - endPoint.x) * (viewBox.w / svg.clientWidth);
        const dy = (startPoint.y - endPoint.y) * (viewBox.h / svg.clientHeight);

        viewBox.x += dx;
        viewBox.y += dy;
        
        updateViewBox();
        startPoint = endPoint;
    });

    const stopPanning = () => {
        if (isPanning) {
            isPanning = false;
            svg.style.cursor = 'grab';
        }
    };
    svg.addEventListener('mouseup', stopPanning);
    svg.addEventListener('mouseleave', stopPanning);


    // --- Diagram Rendering Logic ---
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 * 0.7;
    const nodeElements = {};

    characterData.characters.forEach((char) => {
        let x, y;
        if (char.isCenter) {
            x = centerX;
            y = centerY;
        } else {
            const peripheralChars = characterData.characters.filter(c => !c.isCenter);
            const charIndex = peripheralChars.findIndex(c => c.id === char.id);
            const angle = (2 * Math.PI / peripheralChars.length) * charIndex - (Math.PI / 2);
            x = centerX + radius * Math.cos(angle);
            y = centerY + radius * Math.sin(angle);
        }

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(' + x + ',' + y + ')');
        g.classList.add('node');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '45');
        circle.classList.add('node-circle');
        if (char.isCenter) circle.classList.add('center-node');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.textContent = char.name;
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '0.3em');
        text.classList.add('node-label');

        g.appendChild(circle);
        g.appendChild(text);
        svg.appendChild(g);
        
        nodeElements[char.id] = { x, y, el: g };
    });

    characterData.relationships.forEach(rel => {
        const sourceNode = nodeElements[rel.source];
        const targetNode = nodeElements[rel.target];

        if (sourceNode && targetNode) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', sourceNode.x);
            line.setAttribute('y1', sourceNode.y);
            line.setAttribute('x2', targetNode.x);
            line.setAttribute('y2', targetNode.y);
            line.classList.add('relationship-line');
            svg.insertBefore(line, svg.querySelector('.node'));

            const labelX = (sourceNode.x + targetNode.x) / 2;
            const labelY = (sourceNode.y + targetNode.y) / 2;
            
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            labelText.textContent = rel.label;
            labelText.setAttribute('x', labelX);
            labelText.setAttribute('y', labelY);
            labelText.setAttribute('text-anchor', 'middle');
            labelText.setAttribute('dy', '0.3em');
            labelText.classList.add('relationship-label');
            
            const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            const textLength = rel.label.length * 12;
            labelBg.setAttribute('x', labelX - textLength / 2 - 4);
            labelBg.setAttribute('y', labelY - 10);
            labelBg.setAttribute('width', textLength + 8);
            labelBg.setAttribute('height', 20);
            labelBg.setAttribute('rx', 5);
            labelBg.classList.add('relationship-label-bg');
            
            g.appendChild(labelBg);
            g.appendChild(labelText);
            svg.appendChild(g);
        }
    });
}
