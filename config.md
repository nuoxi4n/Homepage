# 📁 配置文件说明 (config.json)

## 🛠 调试设置 (Debug)
- **showFPS**  
  `boolean` | 是否开启屏幕帧率(FPS)显示  
  *示例: `true` 或 `false`*

## 👤 个人资料 (Profile)
- **name**  
  `string` | 个人昵称/用户名  
  *示例: "技术探险家"*
- **description**  
  `string` | 个人简介描述  
  *示例: "全栈开发者 | AI爱好者"*

## 🌐 社交链接 (Social)
```yaml
- name:        "按钮显示文本"  # 如：GitHub
  hidden:      true/false     # 是否仅显示图标
  iconify:     "图标代码"      # Iconify图标库标识符
  url:         "https://"     # 点击跳转链接
  hoverBg:     "渐变颜色"      # 悬停背景色，支持CSS渐变、
```

## 📁 项目展示 (Projects)
- **projectsName**  
  `string` | 项目名称  
  *示例: "💻Projects"*
- **projectsUrl**  
  `string` | 项目跳转链接  
  *示例: "https://nuoxiana.cn"*
```yaml
- title:       "项目名称"      # 项目名称
  description: "项目描述"      # 项目描述
  url:         "项目链接"      # 点击跳转链接
  iconify:     "项目图标"      # Iconify图标库标识符
```

## 🎖️ 技能展示 (skill)
- **skillName**  
  `string` | 技能名称  
  *示例: "⚡Skills"*
- **skill**  
  `string` | 使用 skillicons.dev 提供的图标生成链接  
  *示例: "https://skillicons.dev/icons?perline=15&i=ae,apple,au"*

## 📊 贪吃蛇贡献图 (githubSnake)
- **githubSnake**  
  `string` | 使用 github.com/Platane/snk 的贡献图生成代码  
  *示例: "https://raw.gitmirror.com/nuoxi4n/nuoxi4n/main/assets/github-contribution-grid-snake-dark.svg"*

## ©️ 底部版权 (footer)
- **footer**  
  `string` | 可以使用html代码  
  *示例: "```<p>© 2020 <a href=\"https://nuoxiana.cn\">nuoxian</a>.```"*