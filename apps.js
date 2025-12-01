const apps = [
    { name: 'Finder', icon: 'https://img.icons8.com/ios-filled/50/ffffff/finder.png', content: 'Welcome to Finder!' },
    { name: 'Safari', icon: 'https://img.icons8.com/ios-filled/50/ffffff/internet.png', content: 'Welcome to Safari!' },
    { name: 'TextEdit', icon: 'https://img.icons8.com/ios-filled/50/ffffff/document.png', content: 'Write your notes here!' },
    { name: 'Terminal', icon: 'https://img.icons8.com/ios-filled/50/ffffff/console.png', content: 'Command line simulator!' }
];

// Create Dock icons dynamically
const dock = document.getElementById('dock');
apps.forEach(app => {
    const appEl = document.createElement('div');
    appEl.className = 'app';
    appEl.innerHTML = `<img src="${app.icon}" alt="${app.name}"><span>${app.name}</span>`;
    appEl.onclick = () => openApp(app.name);
    dock.appendChild(appEl);
});
