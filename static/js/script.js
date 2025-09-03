console.log(
  "\n %c zyyo.net & nuoxian %c https://nuoxiana.cn",
  "color:#777777;background:linear-gradient(to right,#ebf2ed,#e5ebee,#f0e5c7,#f8eef0);padding:5px 0;",
  "color:#fff;background:#f8f8f8;padding:5px 10px 5px 0px;"
);

// 显示FPS
function initFPS() {
  const fpsElement = document.createElement('div');
  fpsElement.id = 'fps';
  
  fpsElement.className = `
    z-50 fixed top-2 left-2
    font-mono text-xs sm:text-sm
    bg-black bg-opacity-70 text-green-400
    px-2 py-1 rounded
    shadow-md
    transition-opacity duration-300
    hover:opacity-100
  `;
  
  // 初始设置为半透明，减少干扰
  fpsElement.style.opacity = '0.7';
  
  document.body.appendChild(fpsElement);

  const requestAnimationFrame = window.requestAnimationFrame || 
                             window.webkitRequestAnimationFrame || 
                             window.mozRequestAnimationFrame || 
                             window.oRequestAnimationFrame || 
                             window.msRequestAnimationFrame;

  let fps = 0, 
      last = Date.now(), 
      frameCount = 0;

  function update() {
    frameCount++;
    const now = Date.now();
    const delta = now - last;

    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      last = now;
      
      // 根据FPS值改变文字颜色
      if (fps < 20) {
        fpsElement.classList.remove('text-green-400', 'text-yellow-400');
        fpsElement.classList.add('text-red-400');
      } else if (fps < 45) {
        fpsElement.classList.remove('text-green-400', 'text-red-400');
        fpsElement.classList.add('text-yellow-400');
      } else {
        fpsElement.classList.remove('text-yellow-400', 'text-red-400');
        fpsElement.classList.add('text-green-400');
      }
    }

    fpsElement.textContent = `FPS: ${fps}`;
    requestAnimationFrame(update);
  }

  if (requestAnimationFrame) {
    requestAnimationFrame(update);
  } else {
    console.warn('requestAnimationFrame 不支持');
  }
  
  // 添加自动隐藏功能（5秒无交互后）
  let hideTimeout;
  const resetHideTimeout = () => {
    clearTimeout(hideTimeout);
    fpsElement.style.opacity = '0.7';
    hideTimeout = setTimeout(() => {
      fpsElement.style.opacity = '0.3';
    }, 5000);
  };
  
  resetHideTimeout();
  document.addEventListener('mousemove', resetHideTimeout);
  document.addEventListener('touchstart', resetHideTimeout);
}

// 禁止右键菜单
function MenuExt() {
  document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
}

// 等待配置加载完成
window.addEventListener('configLoaded', function() {
  if (window.debugConfig?.showFps) {
    initFPS();
  }
  if (window.debugConfig?.menuExt) {
    MenuExt();
  }
});