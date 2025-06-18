# 🛒 实惠助手网页端

智能比价工具，帮助用户找到最实惠的商品选择。通过单价计算和价格对比，让每一分钱都花得更值。

## ✨ 功能特点

- **💰 智能比价**：支持不同规格商品的单价计算和对比
- **📊 价格排名**：直观展示商品价格排名，一目了然
- **📱 移动端优化**：完美适配手机端，支持触摸滑动
- **📷 分享功能**：一键生成精美的分享图片，支持保存到相册
- **🎨 现代设计**：采用 Tailwind CSS，界面简洁美观
- **🚀 性能优化**：代码分割、懒加载，快速响应

## 🛠 技术栈

- **前端框架**：React 18
- **构建工具**：Vite 5.x
- **样式框架**：Tailwind CSS 3.x
- **图片生成**：html2canvas
- **代码规范**：ESLint

## 📦 项目结构

```
project001/
├── src/
│   ├── components/          # React 组件
│   │   ├── ui/             # UI 基础组件
│   │   └── ShareImage.jsx  # 分享图片组件
│   ├── App.jsx             # 主应用组件
│   ├── main.jsx            # 应用入口
│   └── index.css           # 全局样式
├── public/
│   └── _redirects          # Cloudflare 路由配置
├── dist/                   # 构建产出目录
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
└── README.md               # 项目说明
```

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建部署

```bash
# 生产构建
npm run build

# 本地预览
npm run preview
```

## 🌐 部署

本项目部署在 Cloudflare Pages，享受：
- 🌍 全球 CDN 加速
- 🔒 免费 HTTPS 证书  
- 🚀 自动化部署
- 📊 实时性能监控

### 部署设置
- **构建命令**：`npm run build`
- **构建输出目录**：`dist`
- **Node.js 版本**：18.x

## 📱 使用指南

1. **选择商品类别**：选择您要比较的商品类型
2. **添加商品**：输入商品名称、价格和规格
3. **查看结果**：系统自动计算单价并排序
4. **分享结果**：生成精美图片，分享给朋友

## 🔧 开发说明

### 主要组件
- `App.jsx`：主应用逻辑，商品管理和计算
- `ShareImage.jsx`：分享图片生成和处理
- `ui/`：可复用的基础 UI 组件

### 特性实现
- **响应式设计**：使用 Tailwind CSS 实现移动端适配
- **图片生成**：基于 html2canvas 生成分享图片
- **性能优化**：Vite 代码分割，vendor 和 html2canvas 独立打包

## 🐛 问题反馈

如果您在使用过程中遇到问题，请通过以下方式反馈：
- 创建 GitHub Issue
- 提供详细的问题描述和复现步骤

## 📄 许可证

本项目基于 MIT 许可证开源。

---

*让智慧消费成为习惯，让实惠选择更简单！* ✨ 