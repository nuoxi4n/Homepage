document.addEventListener('DOMContentLoaded', function() {
  const CONFIG_SELECTORS = {
    text: '[data-config-text]',
    html: '[data-config-html]',
    href: '[data-config-href]',
    array: '[data-config-array]',
    style: '[data-config-style]',
    src: '[data-config-src]',
    music: '[data-config-music]',
  };

  // ===== 工具函数 =====
  const getConfigValue = (obj, path) => 
    path.split('.').reduce((o, p) => o?.[p], obj);

  const debounce = (func, wait = 100) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // ===== 配置加载 =====
  fetch('config.json')
    .then(response => {
      if (!response.ok) throw new Error(`${response.status}`);
      return response.json();
    })
    .then(config => {
      window.currentConfig = config;
      applyConfig(config);
      window.dispatchEvent(new CustomEvent('configLoaded'));
    })
    .catch(error => {
      console.error('Config Error: ', error);
      document.body.innerHTML = `
        <div class="flex items-center justify-center">
          Failed to load configuration: ${error.message}
        </div>
      `;
    });
  
  // ===== 配置应用主函数 =====
  function applyConfig(config) {
    // 技能图片自适应
    handleSkillImage(config);
    
    // 特殊日期处理
    handleSpecialDates(config);
    
    // 处理文本内容
    processElements(
      config, 
      CONFIG_SELECTORS.text, 
      (el, value) => { el.textContent = value; }, 
      'configText'
    );
    
    // 处理HTML内容
    processElements(
      config, 
      CONFIG_SELECTORS.html, 
      (el, value) => { el.innerHTML = value; }, 
      'configHtml'
    );
    
    // 处理链接内容
    processElements(
      config, 
      CONFIG_SELECTORS.href, 
      (el, value) => { el.href = value; }, 
      'configHref'
    );
    
    // 处理数组内容
    processElements(
      config, 
      CONFIG_SELECTORS.array, 
      (el, value, dataPath) => {
        if (dataPath === 'social') renderSocialItems(el, value);
        else if (dataPath === 'projectsList') renderProjects(el, Object.values(config.projectsList).flat());
      }, 
      'configArray'
    );
    
    // 处理样式
    processElements(
      config, 
      CONFIG_SELECTORS.style, 
      (el, value) => {
        const [styleProp] = el.dataset.configStyle.split(':');
        el.style[styleProp] = `url('${value}')`;
      }, 
      'configStyle'
    );
    
    // 处理图片源
    processElements(
      config, 
      CONFIG_SELECTORS.src, 
      (el, value) => { el.src = value; }, 
      'configSrc'
    );
    
    // 处理音乐播放器
    processElements(
      config, 
      CONFIG_SELECTORS.music, 
      (container, value) => { renderMusicPlayer(container, value); }, 
      'configMusic'
    );
    
    // 页脚和调试配置
    updateFooter(config);
    processDebugConfig(config);
  }

  // ===== 辅助函数 =====
  function handleSkillImage(config) {
    const skillImg = document.getElementById('skill');
    if (!skillImg || !config.skillUrl) return;
    
    const updateSkillImage = debounce(() => {
      const screenWidth = window.innerWidth;
      let perline = 15;
      
      if (screenWidth < 640) perline = 8;
      else if (screenWidth < 1024) perline = 12;
      
      skillImg.src = config.skillUrl.replace(/([?&])perline=\d+/, `$1perline=${perline}`);
    });

    updateSkillImage();
    window.addEventListener('resize', updateSkillImage);
  }

  function processElements(config, selector, processor, dataAttr) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    elements.forEach(el => {
      try {
        const path = el.dataset[dataAttr];
        const value = getConfigValue(config, path);
        if (value) processor(el, value, path);
      } catch (error) {
        console.error(`Error processing element:`, el, error);
      }
    });
  }

  // ===== 渲染函数 =====
  function renderSocialItems(container, items) {
    container.classList.add('flex', 'flex-wrap');
    container.innerHTML = items.map(social => `
      <a class="social-item inline-flex text-current px-3 py-2 mt-2 mr-2 rounded-md transition-colors decoration-none bg-gray-500/20 hover:${social.hoverBg} hover:text-white" 
        href="${social.url}" 
        target="_blank"
        aria-label="${social.name}">
        <div class="text-lg">
          <span class="iconify" data-icon="${social.iconify}"></span>
        </div>
        ${social.hidden ? '' : `<div class="text-sm ml-1 font-medium">${social.name}</div>`}
      </a>
    `).join('');
  }

  function renderProjects(container, projects) {
    container.innerHTML = projects.map(project => `
      <a class="project-item px-4 py-3 text-current rounded-md transition-colors decoration-none bg-gray-400/10 hover:bg-gray-400/20" 
         href="${project.url}" 
         target="_blank"
         aria-label="${project.title}">
        <div class="flex h-full items-center justify-center">
          <div class="flex-1 flex-col">
            <div class="font-medium leading-relaxed flex items-center justify-between">
              <span>${project.title}</span>
            </div>
            <div class="opacity-50 font-normal text-sm">
              ${project.description}
            </div>
          </div>
          <div class="ml-4 text-4xl opacity-80">
            <span class="iconify" data-icon="${project.iconify}"></span>
          </div>
        </div>
      </a>
    `).join('');
  }

  function renderMusicPlayer(container, musicConfig) {
    if (!musicConfig || !musicConfig.enabled) {
      container.innerHTML = '';
      return;
    }

    const {
      server = '',
      type = '',
      id = '',
      fixed = false,
      mini = false,
      autoplay = false,
      theme = '',
      loop = 'all',
      order = 'list',
      preload = 'auto',
      volume = 0.7,
      mutex = true,
      lrcEnabled = false,
      listFolded = false,
      listMaxHeight = '340px',
      storageName = 'metingjs'
    } = musicConfig;

    const metingEl = document.createElement('meting-js');
    const attributes = {
      server,
      type,
      id,
      fixed: fixed.toString(),
      mini: mini.toString(),
      autoplay: autoplay.toString(),
      theme,
      loop: ['all', 'one', 'none'].includes(loop) ? loop : 'all',
      order: ['list', 'random'].includes(order) ? order : 'list',
      preload: ['none', 'metadata', 'auto'].includes(preload) ? preload : 'auto',
      volume: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].includes(volume) ? volume : 0.7,
      mutex: mutex.toString(),
      'lrc-type': lrcEnabled ? undefined : '0',
      'list-folded': listFolded.toString(),
      'list-max-height': listMaxHeight,
      'storage-name': storageName
    };

    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) metingEl.setAttribute(key, value);
    });

    container.innerHTML = '';
    container.appendChild(metingEl);
  }

  // ===== 特殊日期处理 =====
  function handleSpecialDates(config) {
    if (config.enableSpecialDates === false) return;
    if (!Array.isArray(config.specialDates)) return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    
    for (const specialDate of config.specialDates) {
      if (isDateMatch(specialDate, today, year, month, date)) {
        // 应用节日描述
        if (specialDate.description && config.profile) {
          config.profile.description = specialDate.description;
        }
        
        // 应用节日样式
        if (specialDate.style) {
          const target = specialDate.target || 'global';
          
          if (target === 'global') {
            applySpecialDayStyles(specialDate.style);
          } else if (target === 'description') {
            applyDescriptionStyle(specialDate.style);
          }
        }
        break;
      }
    }
  }

  function isDateMatch(specialDate, today, year, month, date) {
    // 单日节日检查
    if (specialDate.day && !specialDate.startDate) {
      return specialDate.month === month && specialDate.day === date;
    }
    
    // 日期范围检查
    if (specialDate.startDate && specialDate.endDate) {
      const [startMonth, startDay] = specialDate.startDate.split('-').map(Number);
      const [endMonth, endDay] = specialDate.endDate.split('-').map(Number);
      
      if (isNaN(startMonth) || isNaN(startDay) || 
          isNaN(endMonth) || isNaN(endDay)) {
        console.warn('Invalid date format in special date:', specialDate);
        return false;
      }
      
      const startDate = new Date(year, startMonth - 1, startDay);
      const endDate = new Date(year, endMonth - 1, endDay + 1);
      
      return today >= startDate && today < endDate;
    }
    
    return false;
  }

  function applySpecialDayStyles(style) {
    const html = document.documentElement;
    
    // Tailwind 类名处理
    if (!style.includes(':')) {
      html.classList.add(...style.split(' '));
      return;
    }
    
    // CSS 样式处理
    const styleId = 'special-day-styles';
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    styleEl.textContent = `html { ${style} }`;
  }

  function applyDescriptionStyle(style) {
    const descriptionElements = document.querySelectorAll('[data-config-html="profile.description"]');
    
    descriptionElements.forEach(el => {
      // 清除之前可能添加的样式
      el.removeAttribute('style');
      el.className = el.className.replace(/bg-gradient-to-r\s+from-[^\s]+\s+via-[^\s]+\s+to-[^\s]+/g, '');
      
      // 应用新样式
      if (!style.includes(':')) {
        // Tailwind 类名处理
        el.classList.add(...style.split(' '));
      } else {
        // CSS 样式处理
        el.setAttribute('style', style);
      }
    });
  }

  // ===== 其他功能 =====
  function updateFooter(config) {
    const footer = document.querySelector('footer');
    if (config.footer) {
      footer.innerHTML = Object.values(config.footer).join('');
    }
  }

  function processDebugConfig(config) {
    window.debugConfig = config.debug || {};
  }

  // 暴露配置值获取方法
  window.getConfigValue = getConfigValue;
});