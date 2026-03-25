# 📁 配置文件说明 (config.json)

## 🛠 调试设置 (Debug)
- **showFPS**  
  `boolean` | 是否开启屏幕帧率(FPS)显示  
  *示例: `true` 或 `false`*
- **menuExt**  
  `boolean` | 是否禁止右键菜单  
  *示例: `true` 或 `false`*

## 👤 个人资料 (Profile)
- **name**  
  `string` | 个人昵称/用户名，支持html代码  
  *示例: "```Hello, I'm <span class=\"text-gradient\">nuoxian</span>```"*
- **title**  
  `string` | 网站标题  
  *示例: "Hi, I'm nuoxian"*
- **description**  
  `string` | 个人简介描述  
  *示例: "Hi, Welcome to nuoxian's HomePage 👋"*

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
- **skillUrl**  
  `string` | 使用 skillicons.dev 提供的图标生成链接  
  *示例: "https://skillicons.dev/icons?perline=15&i=ae,apple,au"*

## 📊 贪吃蛇贡献图 (githubSnake)
- **githubSnake**  
  `string | object` | 使用 github.com/Platane/snk 的贡献图生成代码  
  *字符串示例（单一URL，深浅色复用）:*  
  `"https://raw.gitmirror.com/nuoxi4n/nuoxi4n/main/assets/github-contribution-grid-snake-dark.svg"`  
  *对象示例（分别指定深色/浅色 URL）:*
  ```json
  "githubSnake": {
    "dark": "https://raw.gitmirror.com/nuoxi4n/nuoxi4n/main/assets/github-contribution-grid-snake-dark.svg",
    "light": "https://raw.gitmirror.com/nuoxi4n/nuoxi4n/main/assets/github-contribution-grid-snake.svg"
  }
  ```
  *说明: 对象形式下，主题切换时自动替换对应URL；字符串形式向后兼容。*

## ©️ 底部版权 (footer)
- **footer**  
  `string` | 可以使用html代码  
  *示例: "```<p>© 2020 <a href=\"https://nuoxiana.cn\">nuoxian</a>.```"*

## 🎵 音乐设置 (music)
- **enabled**  
  `boolean` | 是否启用音乐播放器  
  *示例: `true` 或 `false`*
- **server**  
  `string` | 音乐平台  
  *示例: netease、tencent、kugou、xiami、baidu*
- **type**  
  `string` | 音乐类型  
  *示例: song，playlist，album，search，artist*
- **id**  
  `int` | 音乐id  
  *示例: 歌曲 id / 列表 id / 专辑 id / 搜索关键词*
- **fixed**  
  `boolean` | 固定模式  
  *示例: `true` 或 `false`*
- **mini**  
  `boolean` | 迷你模式  
  *示例: `true` 或 `false`*
- **autoplay**  
  `boolean` | 自动播放  
  *示例: `true` 或 `false`*
- **theme**  
  `string` | 播放器主色调  
  *示例: "#2980b9"*
- **loop**  
  `string` | 循环播放  
  *示例: 'all'（全部）, 'one'（单首）, 'none'（无）*
- **order**  
  `string` | 播放顺序  
  *示例: 'list'（列表）, 'random'（随机）*
- **preload**  
  `string` | 预加载  
  *示例: 'none', 'metadata', 'auto'*
- **volume**  
  `string` | 默认音量，请注意播放器会记住用户设置，用户自己设置音量后默认音量将不会生效  
  *示例: "0.7"*
- **mutex**  
  `boolean` | 防止同时播放多个播放器，当此播放器开始播放时暂停其他播放器  
  *示例: `true` 或 `false`*
- **lrcEnabled**  
  `boolean` | 是否启用歌词  
  *示例: `true` 或 `false`*
- **listFolded**  
  `boolean` | 列表是否应首先折叠  
  *示例: `true` 或 `false`*
- **listMaxHeight**  
  `string` | 列表最大高度  
  *示例: "340px"*
- **storageName**  
  `string` | 存储播放器设置的 localStorage 键  
  *示例: "metingjs"*

## 📅 特殊日期 (specialDates)
- **enableSpecialDates**  
  `boolean` | 是否启用特殊日期  
  *示例: `true` 或 `false`*
```yaml
- month:       1            # 月份
  day:         1            # 日份
  description: "元旦快乐！"  # 显示文字
  style:    "bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 text-white" # 样式
  "target": "global"        # 目标元素
```

```yaml
- startDate:   "10-1"         # 开始日期
  endDate:     "10-7"         # 结束日期
  description: "国庆快乐！"    # 显示文字
  style:    "bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 text-white" # 样式
  "target": "description"     # 目标元素
```
