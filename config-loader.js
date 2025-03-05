document.addEventListener('DOMContentLoaded', function() {
    fetch('./config.json')
        .then(response => response.json())
        .then(config => {
            // 全局存储配置
            window.currentConfig = config;
            
            // 处理文本内容
            processTextElements(config);
            
            // 处理HTML内容
            processHtmlElements(config);
            
            // 处理数组内容
            processArrayElements(config);
            
            // 处理样式和图片
            processStyleAttributes(config);
            
            // 处理页脚
            updateFooter(config);
            
            processDebugConfig(config);
            
            // 处理完成后触发配置加载完成事件
            window.dispatchEvent(new CustomEvent('configLoaded'));
        })
        .catch(error => console.error('Config Error: ', error));

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

    function processArrayElements(config) {
        document.querySelectorAll('[data-config-array]').forEach(container => {
            const dataPath = container.dataset.configArray;
            const items = getConfigValue(config, dataPath) || [];
            
            if (dataPath === 'profile.tags') {
                container.innerHTML = items.map(tag => 
                    `<div class="left-tag-item">${tag}</div>`
                ).join('');
            }
            else if (dataPath === 'timeline') {
                container.innerHTML = items.map(item => `
                    <li>
                        <div class="focus"></div>
                        <div>${item.event}</div>
                        <div>${item.date}</div>
                    </li>
                `).join('');
            }
            else if (dataPath === 'social') {
                container.innerHTML = items.map(item => `
                    <a class="iconItem" 
                       ${item.url ? `href="${item.url}"` : 'href="javascript:void(0)"'}
                       ${item.onclick ? `onclick="${item.onclick}"` : ''}>
                        <i class="${item.icon}"></i>
                        <div class="iconTip">${item.name}</div>
                    </a>
                `).join('')+ `
                <a class="switch" href="javascript:void(0)">
                  <div class="onoffswitch">
                    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch">
                    <label class="onoffswitch-label" for="myonoffswitch">
                      <span class="onoffswitch-inner"></span>
                      <span class="onoffswitch-switch"></span>
                    </label>
                  </div>
                </a>
              `;
            }
            // 处理项目数据
            else if (dataPath === 'projects') {
              const allProjects = Object.values(config.projects).flat();
              container.innerHTML = allProjects.map(project => `
                <a class="projectItem b" target="_blank" href="${project.url}">
                  <div class="projectItemLeft">
                    <h1>${project.title}</h1>
                    <p>${project.description}</p>
                  </div>
                  <div class="projectItemRight">
                    <img src="${project.image}" alt="${project.title}">
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
        
        document.querySelectorAll('[data-config-src-light],[data-config-src-dark]').forEach(el => {
            const lightSrc = getConfigValue(config, el.dataset.configSrcLight);
            const darkSrc = getConfigValue(config, el.dataset.configSrcDark);
            
            if (el.classList.contains('light')) {
                el.src = lightSrc;
                // 预加载暗色图片
                new Image().src = darkSrc; 
            } else {
                el.src = darkSrc;
                // 预加载亮色图片
                new Image().src = lightSrc;
            }
        });
    }

    function processDebugConfig(config) {
        window.debugConfig = config.debug || {};
    }

    function updateFooter(config) {
        const footer = document.querySelector('footer');
        if (config.footer) {
          footer.innerHTML = Object.values(config.footer).join('<br>');
        }
    }
    

    function getConfigValue(obj, path) {
        return path.split('.').reduce((o, p) => o?.[p], obj);
    }
});