console.log(
  "\n %c zyyo.net & nuoxian %c https://nuoxiana.cn",
  "color:#777777;background:linear-gradient(to right,#ebf2ed,#e5ebee,#f0e5c7,#f8eef0);padding:5px 0;",
  "color:#fff;background:#f8f8f8;padding:5px 10px 5px 0px;"
);

// 显示FPS
function initFPS() {
  var fpsElement = document.createElement('div');
  fpsElement.id = 'fps';
  fpsElement.style.cssText = `
    z-index: 10000;
    position: fixed;
    top: 10px;
    left: 10px;
    font-family: monospace;
    background: rgba(0,0,0,0.7);
    color: #00ff00;
    padding: 5px 10px;
    border-radius: 5px;
    text-shadow: 0 0 2px #000;
  `;
  
  document.body.insertBefore(fpsElement, document.body.firstChild);

  var requestAnimationFrame = window.requestAnimationFrame || 
                             window.webkitRequestAnimationFrame || 
                             window.mozRequestAnimationFrame || 
                             window.oRequestAnimationFrame || 
                             window.msRequestAnimationFrame;

  var fps = 0, 
      last = Date.now(), 
      frameCount = 0;

  function update() {
    frameCount++;
    var now = Date.now();
    var delta = now - last;

    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      last = now;
    }

    fpsElement.textContent = `FPS: ${fps}`;
    requestAnimationFrame(update);
  }

  if (requestAnimationFrame) {
    requestAnimationFrame(update);
  } else {
    console.warn('requestAnimationFrame 不支持');
  }
}

// 禁止右键菜单
function MenuExt() {
  document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
}

// 主题切换功能（等待配置加载完成）
window.addEventListener('configLoaded', function() {
  if (window.debugConfig?.showFps) {
    initFPS();
  }
  if (window.debugConfig?.menuExt) {
    MenuExt();
  }
});