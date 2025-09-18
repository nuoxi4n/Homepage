document.addEventListener('DOMContentLoaded', function() {
  const CONFIG_SELECTORS = {
    text: '[data-config-text]',
    html: '[data-config-html]',
    href: '[data-config-href]',
    array: '[data-config-array]',
    style: '[data-config-style]',
    src: '[data-config-src]',
    music: '[data-config-music]',
    video: '[data-config-video]'
  };

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
      document.body.innerHTML = `<div class="flex items-center justify-center">Failed to load configuration: ${error.message}</div>`;
    });

  function applyConfig(config) {
    // 处理特殊日期
    handleSpecialDates(config);

    // 处理文本内容
    processSimpleElements(config, CONFIG_SELECTORS.text, el => {
      const value = getConfigValue(config, el.dataset.configText);
      if (value) el.textContent = value;
    });

    // 处理HTML内容
    processSimpleElements(config, CONFIG_SELECTORS.html, el => {
      const value = getConfigValue(config, el.dataset.configHtml);
      if (value) el.innerHTML = value;
    });

    // 处理链接内容
    processSimpleElements(config, CONFIG_SELECTORS.href, el => {
      const value = getConfigValue(config, el.dataset.configHref);
      if (value) el.href = value;
    });

    // 处理数组内容
    processSimpleElements(config, CONFIG_SELECTORS.array, el => {
      const dataPath = el.dataset.configArray;
      const items = getConfigValue(config, dataPath) || [];

      if (dataPath === 'social') {
        renderSocialItems(el, items);
      } else if (dataPath === 'projectsList') {
        renderProjects(el, Object.values(config.projectsList).flat());
      }
    });

    // 处理样式和图片
    processSimpleElements(config, CONFIG_SELECTORS.style, el => {
      const [styleProp, dataPath] = el.dataset.configStyle.split(':');
      const value = getConfigValue(config, dataPath);
      if (value) el.style[styleProp] = `url('${value}')`;
    });

    // 处理链接内容
    processSimpleElements(config, CONFIG_SELECTORS.src, el => {
      const value = getConfigValue(config, el.dataset.configSrc);
      if (value) el.src = value;
    });

    // 处理音乐播放器
    processSimpleElements(config, CONFIG_SELECTORS.music, container => {
      const musicConfig = getConfigValue(config, 'musicPlayer');
      renderMusicPlayer(container, musicConfig);
    });

    // 处理视频
    processSimpleElements(config, CONFIG_SELECTORS.video, el => {
      const videoConfig = getConfigValue(config, el.dataset.configVideo);
      if (videoConfig) {
        const videoEl = document.createElement('video');
        videoEl.src = videoConfig.src;
        videoEl.controls = true;
        el.innerHTML = '';
        el.appendChild(videoEl);
      }
    });

    // 处理页脚和调试配置
    updateFooter(config);
    processDebugConfig(config);
  }

  // 通用元素处理函数
  function processSimpleElements(config, selector, processor) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    elements.forEach(el => {
      try {
        processor(el);
      } catch (error) {
        console.error(`Error processing element:`, el, error);
      }
    });
  }

  // 渲染社交项目
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

  // 渲染项目
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

  // 渲染音乐播放器
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

  // 特殊日期处理函数
  function handleSpecialDates(config) {
    if (config.enableSpecialDates === false) return;
    if (!Array.isArray(config.specialDates)) return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    
    for (const specialDate of config.specialDates) {
      if (isDateMatch(specialDate, today, year, month, date)) {
        // 应用节日描述（修改配置）
        if (specialDate.description && config.profile) {
          config.profile.description = specialDate.description;
        }
        
        // 应用节日样式（直接操作DOM）
        if (specialDate.cssStyle) {
          applySpecialDayStyles(specialDate.cssStyle);
        }
        
        // 找到匹配项后停止检查
        break;
      }
    }
  }

  // 日期匹配检查
  function isDateMatch(specialDate, today, year, month, date) {
    // 单日节日检查
    if (specialDate.day && !specialDate.startDate) {
      return specialDate.month === month && specialDate.day === date;
    }
    
    // 日期范围检查
    if (specialDate.startDate && specialDate.endDate) {
      const [startMonth, startDay] = specialDate.startDate.split('-').map(Number);
      const [endMonth, endDay] = specialDate.endDate.split('-').map(Number);
      
      // 验证日期格式
      if (isNaN(startMonth) || isNaN(startDay) || 
          isNaN(endMonth) || isNaN(endDay)) {
        console.warn('Invalid date format in special date:', specialDate);
        return false;
      }
      
      // 创建日期对象
      const startDate = new Date(year, startMonth - 1, startDay);
      const endDate = new Date(year, endMonth - 1, endDay + 1); // +1 包含结束日期
      
      return today >= startDate && today < endDate;
    }
    
    return false;
  }

  // 应用特殊日期样式
  function applySpecialDayStyles(cssStyle) {
    const html = document.documentElement;
    
    // Tailwind 类名处理
    if (!cssStyle.includes(':')) {
      html.classList.add(...cssStyle.split(' '));
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
    
    styleEl.textContent = `html { ${cssStyle} }`;
  }

  // 更新页脚
  function updateFooter(config) {
    const footer = document.querySelector('footer');
    if (config.footer) {
      footer.innerHTML = Object.values(config.footer).join('');
    }
  }

  // 处理调试配置
  function processDebugConfig(config) {
    window.debugConfig = config.debug || {};
  }

  // 获取配置值
  window.getConfigValue = function(obj, path) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  };
});