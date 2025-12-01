const apps = [
  { name:'Finder', icon:'https://img.icons8.com/ios-filled/50/ffffff/finder.png', content:'Welcome to Finder!', menu:['About Finder','Preferences','Quit Finder'] },
  { name:'Safari', icon:'https://img.icons8.com/ios-filled/50/ffffff/internet.png', content:'Welcome to Safari!', menu:['About Safari','Preferences','Quit Safari'] },
  { name:'TextEdit', icon:'https://img.icons8.com/ios-filled/50/ffffff/document.png', content:'Write your notes here!', menu:['New','Open','Quit TextEdit'] },
  { name:'Terminal', icon:'https://img.icons8.com/ios-filled/50/ffffff/console.png', content:'Command line simulator!', menu:['New Window','Preferences','Quit Terminal'] }
];

// Dock icons
const dock = document.getElementById('dock');
apps.forEach(app => {
  const appEl = document.createElement('div');
  appEl.className='app';
  appEl.innerHTML=`<img src="${app.icon}" alt="${app.name}"><span>${app.name}</span>`;
  appEl.onclick=()=>openApp(app.name);
  dock.appendChild(appEl);
});

// Virtual desktops
const desktops = [[],[],[]]; // 3 desktops
let currentDesktop = 0;
const desktopSwitcher = document.getElementById('desktop-switcher');
for(let i=0;i<desktops.length;i++){
  const btn = document.createElement('div');
  btn.className='desktop-btn';
  if(i===0) btn.classList.add('active');
  btn.onclick = ()=>switchDesktop(i);
  desktopSwitcher.appendChild(btn);
}
function switchDesktop(index){
  [...windowsContainer.children].forEach(w=>w.style.display='none');
  desktops[currentDesktop] = [...windowsContainer.children];
  windowsContainer.innerHTML='';
  desktops[index].forEach(w=>windowsContainer.appendChild(w));
  currentDesktop=index;
  [...desktopSwitcher.children].forEach((b,i)=>b.classList.toggle('active', i===index));
}
