console.log(
  "\n %c zyyo.net & nuoxian %c https://nuoxiana.cn",
  "color:#777777;background:linear-gradient(to right,#ebf2ed,#e5ebee,#f0e5c7,#f8eef0);padding:5px 0;",
  "color:#fff;background:#f8f8f8;padding:5px 10px 5px 0px;"
);

// ===== 主题切换功能 =====
(function initTheme() {
  // NOTE: 此键名必须与 index.html <head> 内联脚本中的键名保持一致
  const STORAGE_KEY = 'theme-preference';
  const THEMES = ['system', 'light', 'dark'];
  const TITLES = { system: '当前：跟随系统', light: '当前：浅色模式', dark: '当前：深色模式' };

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'system';
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'system') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.title = TITLES[theme] || '';
  }

  function cycleTheme() {
    const current = getTheme();
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    applyTheme(next);
  }

  // 初始主题已由 <head> 内联脚本提前应用（避免 FOUC）
  // 这里只需初始化按钮状态
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.title = TITLES[getTheme()] || '';
      btn.addEventListener('click', cycleTheme);
    }
  });
}());

// ===== FPS 显示功能 =====
function initFPS() {
  // 创建 FPS 元素
  const fpsElement = document.createElement('div');
  fpsElement.id = 'fps';
  
  // 设置样式类
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
  
  // 添加到文档
  document.body.appendChild(fpsElement);

  // 兼容性处理
  const requestAnimationFrame = 
    window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame;

  // FPS 计算变量
  let fps = 0, 
      last = Date.now(), 
      frameCount = 0;

  // FPS 更新函数
  function update() {
    frameCount++;
    const now = Date.now();
    const delta = now - last;

    // 每秒更新一次 FPS 显示
    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      last = now;
      
      // 根据 FPS 值改变文字颜色
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

    // 更新显示文本
    fpsElement.textContent = `FPS: ${fps}`;
    
    // 继续更新
    requestAnimationFrame(update);
  }

  // 启动 FPS 更新
  if (requestAnimationFrame) {
    requestAnimationFrame(update);
  } else {
    console.warn('requestAnimationFrame 不支持');
  }
  
  // ===== 自动隐藏功能 =====
  let hideTimeout;
  
  // 重置隐藏计时器
  const resetHideTimeout = () => {
    clearTimeout(hideTimeout);
    fpsElement.style.opacity = '0.7';
    
    // 5秒无交互后降低透明度
    hideTimeout = setTimeout(() => {
      fpsElement.style.opacity = '0.3';
    }, 5000);
  };
  
  // 初始化并添加事件监听
  resetHideTimeout();
  document.addEventListener('mousemove', resetHideTimeout);
  document.addEventListener('touchstart', resetHideTimeout);
}

// ===== 禁止右键菜单功能 =====
function MenuExt() {
  document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
}

// ===== 配置加载完成后执行 =====
window.addEventListener('configLoaded', function() {
  // 根据调试配置启用功能
  if (window.debugConfig?.showFps) {
    initFPS();
  }
  
  if (window.debugConfig?.menuExt) {
    MenuExt();
  }
});