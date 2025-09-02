document.addEventListener('DOMContentLoaded', function() {
  fetch('./config.json')
    .then(response => response.json())
    .then(config => {
      // 全局存储配置
      window.currentConfig = config;

      // 处理标题内容
      processTitleElements(config);
      // 处理名称内容
      processNameElements(config);
      // 处理文本内容
      processTextElements(config);
      // 处理HTML内容
      processHtmlElements(config);
      // 处理链接内容
      processHrefElements(config);
      // 处理数组内容
      processArrayElements(config);
      // 处理样式和图片
      processStyleAttributes(config);
      // 处理页脚
      updateFooter(config);
      // 处理DeBug
      processDebugConfig(config);

      // 处理完成后触发配置加载完成事件
      window.dispatchEvent(new CustomEvent('configLoaded'));
    })
    .catch(error => console.error('Config Error: ', error));

  function processTitleElements(config) {
    document.querySelectorAll('[data-config-title]').forEach(el => {
      const value = getConfigValue(config, el.dataset.configTitle);
      if (value) el.textContent = "Hi, I'm " + value;
    });
  }

  function processNameElements(config) {
    document.querySelectorAll('[data-config-name]').forEach(el => {
      const value = getConfigValue(config, el.dataset.configName);
      if (value) el.innerHTML = "Hello, I'm <span class=\"text-gradient\">" + value + "</span>";
    });
  }

  function processTextElements(config) {
    document.querySelectorAll('[data-config-text]').forEach(el => {
      const value = getConfigValue(config, el.dataset.configText);
      if (value) el.textContent = value;
    });
  }

  function processHtmlElements(config) {
    document.querySelectorAll('[data-config-html]').forEach(el => {
      const value = getConfigValue(config, el.dataset.configHtml);
      if (value) el.innerHTML = value;
    });
  }

  function processHrefElements(config) {
    document.querySelectorAll('[data-config-href]').forEach(el => {
      const value = getConfigValue(config, el.dataset.configHref);
      if (value) el.href = value;
    });
  }

  function processArrayElements(config) {
    document.querySelectorAll('[data-config-array]').forEach(container => {
      const dataPath = container.dataset.configArray;
      const items = getConfigValue(config, dataPath) || [];

      // 处理社交按钮数据
      if (dataPath === 'social') {
        container.classList.add('flex', 'flex-wrap');
        container.innerHTML = items.map(social => `
          <a class="inline-flex text-current px-3 py-2 mt-2 mr-2 rounded-md transition-colors decoration-none bg-gray-500/20 hover:${social.hoverBg} hover:text-white" href="${social.url}" target="_blank">
            <div class="text-lg">
              <span class="iconify" data-icon="${social.iconify}"></span>
            </div>
            ${social.hidden ? '' : `
              <div class="text-sm ml-1 font-medium">${social.name}</div>
            `}
          </a>
        `).join('');
      }
      // 处理项目数据
      else if (dataPath === 'projects') {
        const allProjects = Object.values(config.projects).flat();
        container.innerHTML = allProjects.map(project => `
          <a class="px-4 py-3 text-current rounded-md transition-colors decoration-none bg-gray-400/10 hover:bg-gray-400/20" href="${project.url}" target="_blank">
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
    });
  }

  function processStyleAttributes(config) {
    document.querySelectorAll('[data-config-style]').forEach(el => {
      const [styleProp, dataPath] = el.dataset.configStyle.split(':');
      const value = getConfigValue(config, dataPath);
      if (value) el.style[styleProp] = `url('${value}')`;
    });

    document.querySelectorAll('[data-config-src]').forEach(el => {
      const value = getConfigValue(config, el.dataset.configSrc);
      if (value) el.src = value;
    });
  }

  function processDebugConfig(config) {
    window.debugConfig = config.debug || {};
  }

  function updateFooter(config) {
    const footer = document.querySelector('footer');
    if (config.footer) {
      footer.innerHTML = Object.values(config.footer).join('');
    }
  }

  window.getConfigValue = function(obj, path) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  };
});