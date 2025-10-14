# 一、项目初始化

首先，我需要使用Vite的命令行工具来初始化一个React+TypeScript项目

```powershell
npm create vite@latest . -- --template react-ts 
```

具体来说：

- `npm create vite@latest` 是 Vite 官方的项目初始化命令
- `.` 表示「在当前文件夹中创建项目」，而不是新建一个专门的项目文件夹
- `-- --template react-ts` 表示指定使用 React + TypeScript 模板

或者新建文件

```powershell
# 使用 npm
npm create vite@latest my-react-ts-app -- --template react-ts
```

- `my-react-ts-app` 是项目名称，可自定义
- `--template react-ts` 指定使用 React + TypeScript 模板

生成的项目结构如下（核心文件）：

```plaintext
my-react-ts-app/
├── node_modules/        # 依赖包
├── public/              # 静态资源（如 favicon.ico）
├── src/
│   ├── App.css          # App 组件样式
│   ├── App.tsx          # 根组件（TSX 格式，支持 TS）
│   ├── index.css        # 全局样式
│   ├── index.tsx        # 入口文件（渲染 App 组件）
│   ├── vite-env.d.ts    # Vite 类型声明（确保 TS 识别 .svg 等文件）
├── .gitignore           # Git 忽略文件配置
├── index.html           # 入口 HTML
├── package.json         # 项目依赖和脚本
├── tsconfig.json        # TypeScript 配置
├── tsconfig.node.json   # Node 环境的 TS 配置
└── vite.config.ts       # Vite 配置文件
```

关键配置文件说明：

1.  `vite.config.ts`(Vite 配置)

   在这里可以配置端口，代理，插件等， 比如配置开发环境API代理（解决跨域）

   ```ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   
   // https://vite.dev/config/
   export default defineConfig({
     plugins: [react()],
   })
   ```

   

2. `tsconfig.app.json`(TypeScript配置）

   ```ts
   {
     "compilerOptions": {
       "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
       "target": "ES2022",
       "useDefineForClassFields": true,
       "lib": ["ES2022", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "types": ["vite/client"],
       "skipLibCheck": true,
   
       /* Bundler mode */
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "verbatimModuleSyntax": true,
       "moduleDetection": "force",
       "noEmit": true,
       "jsx": "react-jsx",
   
       /* Linting */
       "strict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "erasableSyntaxOnly": true,
       "noFallthroughCasesInSwitch": true,
       "noUncheckedSideEffectImports": true
     },
     "include": ["src"]
   }
   
   ```

   

   - `tsconfig.app.json`：仅管 **应用业务代码**（`src/` 目录下的组件、工具函数等），是项目运行的核心代码。
   - `tsconfig.node.json`：仅管 **Node 环境相关的配置代码**（如 `vite.config.ts`），这类代码运行在 Node 端，而非浏览器端。
   - `tsconfig.json`（可选）：作为「根配置」，通过 `extends` 继承给 `app` 和 `node` 配置，提取公共规则（如 `strict: true`），减少重复配置。

   通过`npm run dev`可以运行整个项目



# 二、实现布局和首页



创建基础目录 ：在 src 目录下创建 components 、 layouts 、 pages 、 styles、router 等目录

创建布局组件 ：
- 在 src/layouts 目录下创建 MainLayout.tsx ，实现应用的主要布局结构
- 在 src/components/layouts 目录下创建 Header.tsx 和 Footer.tsx ，实现页面头部和页脚组件

实现页面组件 ：

+ 在根组件`App.tsx`中添加布局组件，整体布局采用上中下三栏布局