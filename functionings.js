const windowsContainer = document.getElementById('windows');
let zIndex = 1;
const activeAppLabel = document.getElementById('active-app');

// Update clock
function updateTime() {
    const timeEl = document.getElementById('time');
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
setInterval(updateTime, 1000);
updateTime();

// Open or focus app
function openApp(name) {
    activeAppLabel.textContent = name;
    let existing = [...windowsContainer.children].find(w => w.dataset.app === name);
    if (existing) {
        if (existing.classList.contains('minimized')) {
            existing.classList.remove('minimized');
        }
        existing.style.zIndex = zIndex++;
        return;
    }

    const appData = apps.find(a => a.name === name);
    const win = document.createElement('div');
    win.className = 'window';
    win.dataset.app = name;
    win.style.top = Math.random() * 200 + 50 + 'px';
    win.style.left = Math.random() * 500 + 50 + 'px';
    win.style.zIndex = zIndex++;

    win.innerHTML = `
        <div class="window-header">
            <div>${name}</div>
            <div>
                <span onclick="minimizeWindow(this)">_</span>
                <span onclick="maximizeWindow(this)">⬜</span>
                <span onclick="closeWindow(this)">✕</span>
            </div>
        </div>
        <div class="window-body">${appData.content}</div>
        <div class="resizer"></div>
    `;

    makeDraggable(win);
    makeResizable(win);
    windowsContainer.appendChild(win);
}

// Window functions
function closeWindow(el) {
    const win = el.closest('.window');
    win.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => win.remove(), 300);
}
function minimizeWindow(el) {
    const win = el.closest('.window');
    win.classList.add('minimized');
}
function maximizeWindow(el) {
    const win = el.closest('.window');
    if (win.dataset.maximized) {
        win.style.width = win.dataset.prevWidth;
        win.style.height = win.dataset.prevHeight;
        win.style.top = win.dataset.prevTop;
        win.style.left = win.dataset.prevLeft;
        delete win.dataset.maximized;
    } else {
        win.dataset.prevWidth = win.style.width;
        win.dataset.prevHeight = win.style.height;
        win.dataset.prevTop = win.style.top;
        win.dataset.prevLeft = win.style.left;
        win.style.top = '24px';
        win.style.left = '0';
        win.style.width = '100%';
        win.style.height = 'calc(100% - 24px)';
        win.dataset.maximized = true;
    }
}

// Dragging
function makeDraggable(el) {
    const header = el.querySelector('.window-header');
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

// Resizing
function makeResizable(el) {
    const resizer = el.querySelector('.resizer');
    let isResizing = false, lastX, lastY;
    resizer.addEventListener('mousedown', e => {
        isResizing = true;
        lastX = e.clientX;
        lastY = e.clientY;
        e.stopPropagation();
    });
    document.addEventListener('mousemove', e => {
        if (!isResizing) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        el.style.width = (el.offsetWidth + dx) + 'px';
        el.style.height = (el.offsetHeight + dy) + 'px';
        lastX = e.clientX;
        lastY = e.clientY;
    });
    document.addEventListener('mouseup', () => isResizing = false);
}
