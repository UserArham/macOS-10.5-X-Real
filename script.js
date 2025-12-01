let windowsContainer = document.getElementById('windows');
let zIndex = 1;

function openApp(name) {
    let win = document.createElement('div');
    win.className = 'window';
    win.style.top = Math.random() * 200 + 'px';
    win.style.left = Math.random() * 300 + 'px';
    win.style.zIndex = zIndex++;

    win.innerHTML = `
        <div class="window-header">
            <div>${name}</div>
            <span onclick="closeWindow(this)">✕</span>
        </div>
        <div class="window-body">
            <p>Welcome to ${name} on macOS 10.7 Simulator!</p>
        </div>
    `;

    makeDraggable(win);
    windowsContainer.appendChild(win);
}

function closeWindow(el) {
    el.closest('.window').remove();
}

// Simple draggable
function makeDraggable(el) {
    let header = el.querySelector('.window-header');
    let offsetX, offsetY, isDown = false;

    header.addEventListener('mousedown', e => {
        isDown = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        el.style.zIndex = zIndex++;
    });

    document.addEventListener('mousemove', e => {
        if (!isDown) return;
        el.style.left = e.clientX - offsetX + 'px';
        el.style.top = e.clientY - offsetY + 'px';
    });

    document.addEventListener('mouseup', () => isDown = false);
}
