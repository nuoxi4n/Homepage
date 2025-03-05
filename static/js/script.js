console.log("\n %c zyyo.net & nuoxian %c www.nuoxiana.cn", "color:#777777;background:linear-gradient(to right,#ebf2ed,#e5ebee,#f0e5c7,#f8eef0);padding:5px 0;", "color:#fff;background:#f8f8f8;padding:5px 10px 5px 0px;");

document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

// 按钮交互效果
function handlePress(event) {
  this.classList.add('pressed');
}

function handleRelease(event) {
  this.classList.remove('pressed');
}

function handleCancel(event) {
  this.classList.remove('pressed');
}

document.addEventListener('DOMContentLoaded', function() {
  var buttons = document.querySelectorAll('.projectItem');
  buttons.forEach(function(button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
  });
  var fpsElement = document.createElement('div');
  fpsElement.id = 'fps';
  fpsElement.style.zIndex = '10000';
  fpsElement.style.position = 'fixed';
  fpsElement.style.left = '0';
  document.body.insertBefore(fpsElement, document.body.firstChild);

  var showFPS = (function () {
    var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };

    var fps = 0,
      last = Date.now(),
      offset, step, appendFps;

      step = function () {
        offset = Date.now() - last;
        fps += 1;
        
        if (offset >= 1000) {
          last += offset;
          appendFps(fps);
          fps = 0;
        }

        requestAnimationFrame(step);
      };

      appendFps = function (fpsValue) {
        fpsElement.textContent = 'FPS: ' + fpsValue;
      };

      step();
  })();
});

// 弹窗功能
function toggleClass(selector, className) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function(element) {
    element.classList.toggle(className);
  });
}

function pop(imageURL) {
  var tcMainElement = document.querySelector(".imgbox-img");
  if (imageURL) tcMainElement.src = imageURL;
  toggleClass(".imgbox-main", "active");
  toggleClass(".imgbox", "active");
}

document.addEventListener('DOMContentLoaded', function() {
  var imgbox = document.querySelector('.imgbox');
  var imgbox_main = document.querySelector('.imgbox-main');
  if (imgbox && imgbox_main) {
    imgbox.addEventListener('click', pop);
    imgbox_main.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
});

// Cookie 操作函数
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length);
  }
  return null;
}

// 主题切换功能（等待配置加载完成）
window.addEventListener('configLoaded', function() {
    const themeSwitch = document.getElementById('myonoffswitch');
    const html = document.querySelector('html');
    let themeState = getCookie("themeState") || "Light";

    function updateTheme(theme) {
        themeState = theme;
        html.dataset.theme = theme;
        setCookie("themeState", theme, 365);
        themeSwitch.checked = theme === 'Light';
        
        // 强制重绘保证动画触发
        document.querySelectorAll('.theme-svg').forEach(svg => {
            svg.offsetWidth;
        });
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            updateTheme(themeState === 'Dark' ? 'Light' : 'Dark');
        });
        
        // 初始化主题状态
        updateTheme(themeState === 'Dark' ? 'Dark' : 'Light');
}
});

// 加载动画
var pageLoading = document.querySelector("#loading");
window.addEventListener('load', function() {
  setTimeout(function() {
    if (pageLoading) pageLoading.style.opacity = '0';
  }, 100);
});