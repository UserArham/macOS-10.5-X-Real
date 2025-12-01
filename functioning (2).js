const windowsContainer = document.getElementById('windows');
let zIndex = 1;
const activeAppLabel = document.getElementById('active-app');
const menuDropdown = document.getElementById('menu-dropdown');

// Clock
function updateTime(){
  const timeEl = document.getElementById('time');
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}
setInterval(updateTime,1000); updateTime();

// Open or focus app
function openApp(name){
  activeAppLabel.textContent=name;
  menuDropdown.style.display='none';
  let existing = [...windowsContainer.children].find(w=>w.dataset.app===name);
  if(existing){
    existing.classList.remove('minimized');
    existing.style.zIndex = zIndex++;
    return;
  }
  const appData = apps.find(a=>a.name===name);
  const win = document.createElement('div');
  win.className='window'; win.dataset.app=name;
  win.style.top=Math.random()*200+50+'px';
  win.style.left=Math.random()*500+50+'px';
  win.style.zIndex=zIndex++;
  win.innerHTML=`
    <div class="window-header">
      <div onclick="showMenu(event,'${name}')">${name}</div>
      <div>
        <span onclick="minimizeWindow(this)">_</span>
        <span onclick="maximizeWindow(this)">⬜</span>
        <span onclick="closeWindow(this)">✕</span>
      </div>
    </div>
    <div class="window-body">${appData.content}</div>
    <div class="resizer"></div>
  `;
  makeDraggable(win); makeResizable(win); windowsContainer.appendChild(win);
}

// Window functions
function closeWindow(el){const win=el.closest('.window');win.style.animation='fadeOut 0.3s forwards';setTimeout(()=>win.remove(),300);}
function minimizeWindow(el){el.closest('.window').classList.add('minimized');}
function maximizeWindow(el){const win=el.closest('.window');if(win.dataset.maximized){win.style.width=win.dataset.prevWidth;win.style.height=win.dataset.prevHeight;win.style.top=win.dataset.prevTop;win.style.left=win.dataset.prevLeft;delete win.dataset.maximized;}else{win.dataset.prevWidth=win.style.width;win.dataset.prevHeight=win.style.height;win.dataset.prevTop=win.style.top;win.dataset.prevLeft=win.style.left;win.style.top='24px';win.style.left='0';win.style.width='100%';win.style.height='calc(100% - 24px)';win.dataset.maximized=true;}}

// Dragging + snapping
function makeDraggable(el){
  const header=el.querySelector('.window-header');let offsetX,offsetY,isDown=false;
  header.addEventListener('mousedown',e=>{isDown=true;offsetX=e.clientX-el.offsetLeft;offsetY=e.clientY-el.offsetTop;el.style.zIndex=zIndex++;});
  document.addEventListener('mousemove',e=>{if(!isDown) return; el.style.left=e.clientX-offsetX+'px'; el.style.top=e.clientY-offsetY+'px';snapWindow(el);});
  document.addEventListener('mouseup',()=>isDown=false);
}

// Snap windows to edges
function snapWindow(el){
  const w=window.innerWidth,h=window.innerHeight;
  const rect=el.getBoundingClientRect();
  // Top edge (maximize)
  if(rect.top<30){maximizeWindow({closest:()=>el}); return;}
  // Left/right half
  if(rect.left<50){el.style.left='0';el.style.top='24px';el.style.width='50%';el.style.height=(h-24)+'px';}
  else if(rect.right>w-50){el.style.left='50%';el.style.top='24px';el.style.width='50%';el.style.height=(h-24)+'px';}
}

// Resizing
function makeResizable(el){
  const resizer=el.querySelector('.resizer');let isResizing=false,lastX,lastY;
  resizer.addEventListener('mousedown',e=>{isResizing=true;lastX=e.clientX;lastY=e.clientY;e.stopPropagation();});
  document.addEventListener('mousemove',e=>{if(!isResizing) return; el.style.width=(el.offsetWidth+e.clientX-lastX)+'px'; el.style.height=(el.offsetHeight+e.clientY-lastY)+'px'; lastX=e.clientX; lastY=e.clientY;});
  document.addEventListener('mouseup',()=>isResizing=false);
}

// Menu bar
function showMenu(event,appName){
  const appData=apps.find(a=>a.name===appName);
  menuDropdown.innerHTML='';
  appData.menu.forEach(item=>{
    const div=document.createElement('div'); div.textContent=item;
    div.onclick=()=>alert(item);
    menuDropdown.appendChild(div);
  });
  menuDropdown.style.left=event.target.getBoundingClientRect().left+'px';
  menuDropdown.style.display='flex';
}
document.addEventListener('click',e=>{if(!e.target.closest('.window-header div')) menuDropdown.style.display='none';});
