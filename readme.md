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

采用「Header + MainContent（路由容器） + Footer」垂直布局，Header 导航控制 MainContent 路由切换。

采用 **CSS-in-JS 方案**，基于 Emotion 实现样式管理，

初始化项目结构大致如下，后续有需要再进行添加

```
my-react-ts-app/
├── node_modules/        # 依赖包
├── public/              # 静态资源（如 favicon.ico）
├── src/
│   ├── assets           # 静态资源（图标等）
│   ├── components       # 公共组件
│   ├── layouts          # 页面布局
│   ├── pages            # 放置不同的页面组件
│   ├── router           # 路由相关配置
│   ├── styles           # 公共样式和全局样式
│   ├── App.tsx          # 根组件（TSX 格式，支持 TS）
│   ├── index.tsx        # 入口文件（渲染 App 组件）
│   ├── vite-env.d.ts    # Vite 类型声明（确保 TS 识别 .svg 等文件）
├── .gitignore           # Git 忽略文件配置
├── index.html           # 入口 HTML
├── package.json         # 项目依赖和脚本
├── tsconfig.json        # TypeScript 配置
├── tsconfig.node.json   # Node 环境的 TS 配置
└── vite.config.ts       # Vite 配置文件
```

接下来，导入相应的依赖

```powershell
npm install @emotion/react @emotion/styled
npm install react-router-dom
```

然后，在`router`文件夹中创建`index.tsx`导入相应的路由,  注意应先创建空白组件

```ts
import { lazy } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

// 异步加载组件
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const NotesPage = lazy(() => import('@/pages/NotesPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const CodePage = lazy(() => import('@/pages/CodePage'));

// 路由配置
const routes = createHashRouter([
  {
    path:'/',
    element:<MainLayout />,
    errorElement:<NotFoundPage />,
    children:[
      {
        index:true,
        element:<HomePage />,
      },
      {
        path:'blog',
        element:<BlogPage />,
      },
      {
        path:'notes',
        element:<NotesPage />,
      },
      {
        path:'projects',
        element:<ProjectsPage />,
      },
      {
        path:'code',
        element:<CodePage />,
      }
    ]
  }
])
// 导出路由提供者组件,用于在应用中渲染路由
export const AppRouter: React.FC = () =>{
  return (
    <RouterProvider router={routes} />
  )
}
export default routes;
```

修改`App.tsx`

```ts
import { AppRouter } from './router';

function App() {
  return <AppRouter />;
}

export default App;

```



编写核心布局组件（MainLayout）：其基于上下结构封装了通用组件`Header`、`Footer`和`MainContent`，并通过React Router的`<Outlet />`实现子路由的内容的动态渲染，在 React Router 中，`<Outlet />` 是一个特殊的组件，用于**在父路由组件中渲染子路由对应的组件**，简单说就是 “子路由内容的占位符”。

```ts
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from './Header';
import Footer from './Footer';
import { theme } from '../styles/theme';

// 应用容器
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// 主内容区域
const MainContent = styled.main`
  flex: 1;
  background-color: ${theme.colors.backgroundSecondary};
  min-height: calc(100vh - 200px); // 减去header和footer的大概高度
`;

const MainLayout: React.FC = () => {
  return (
    <>
      <AppContainer>
        <Header />
        <MainContent>
          <Outlet />
        </MainContent>
        <Footer />
      </AppContainer>
    </>
  );
};

export default MainLayout;
```



接下来，开始编写`Header`部分，主要分为 左右两部分，其中左边是标题Logo，使用svg做成动画形式，右边是一个导航栏：

## 2.1 Logo部分

+ 对于左边的Logo，单独创建一个组件为`AnimatedLogo.tsx`, 其主要内容如下：

  这个Logo主要是融合了动态文字显示与小鸟动画的交互， 该组件的核心是实现 "文字逐字显示" 与 "小鸟跟随动画" 的联动效果：

  - 文字内容`welcome to zzz blog`会逐字渐进式显示；
  - 一只 SVG 绘制的小鸟会随着文字显示过程 "飞行"，每显示一个字符，小鸟会有一次短途飞行动画；
  - 当所有文字显示完成后，小鸟会 "着陆" 到文字末尾，并进入待机状态（轻微浮动、翅膀扇动、尾巴摇动）；
  - 整体作为可点击的 Logo 链接（通过`Link`组件跳转到首页）

首先搭建页面，将组件的结构进行拆分：

+ 首先是主组件`<LogoContainer>`，它应该是一个可点击的Logo，然后内部包含“文字”和“小鸟” 两个元素，所以他应该是一个路由链接（Link），这里之所以用React Router 中的Link（本质是<a>标签的封装>,而不用div，是因为div实现跳转手动绑定 `onClick` 事件，通过 `useNavigate`（react-router-dom v6+）或 `window.location.href` 触发跳转，代码冗余；而 `Link` 是 `react-router-dom` 提供的**路由跳转专用组件**，只需通过 `to="/"` 就能直接绑定首页路径，无需额外写事件逻辑，代码更简洁

  ```tsx
  // 第一步：先搭最外层骨架（只关注DOM层级，不写样式和逻辑）
  import React from 'react';
  import { Link } from 'react-router-dom';
  
  // 先定义SVG小鸟的空结构（后续再画细节）
  const SvgBird: React.FC = () => (
    <svg width="28" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 后续补充小鸟图形细节 */}
    </svg>
  );
  
  const AnimatedLogo: React.FC = () => {
    // 先写死文字（后续再做逐字显示）
    const fullText = 'welcome to zzz blog';
  
    return (
      {/* 顶层：Logo链接（跳首页） */}
      <Link to="/">
        {/* 包裹层：同时装文字和小鸟（后续用ref算宽度） */}
        <span>
          {/* 文字元素（后续加渐变和逐字显示） */}
          <span>{fullText}</span>
          {/* 小鸟容器（后续加定位和动画） */}
          <div>
            <SvgBird />
          </div>
        </span>
      </Link>
    );
  };
  
  export default AnimatedLogo;
  ```

+ 定义样式组件

  ```ts
  // 第二步：补充基础样式（先解决布局，不写动画）
  import styled from '@emotion/styled';
  
  // 1. 顶层Logo链接样式（基础布局+hover效果）
  const LogoContainer = styled(Link)`
    display: inline-flex;
    align-items: center;
    position: relative; // 为小鸟绝对定位做父容器
    padding: 0.6rem 1rem;
    font-family: 'Press Start 2P', monospace; // 字体风格
    font-size: 1.5rem;
    text-decoration: none;
    &:hover { transform: translateY(-2px); } // 简单hover反馈
  `;
  
  // 2. 文字+小鸟的包裹层（用于计算宽度，因为小鸟的走动是根据当前容器的宽度）
  const ContentWrapper = styled.span`
    display: inline-flex;
    align-items: center;
    position: relative;
  `;
  
  // 3. 文字基础样式（先加渐变色，不写动画）
  const Text = styled.span`
    text-transform: lowercase;
    letter-spacing: 0.05em;
    // 基础渐变色（后续加流动动画）
    background: linear-gradient(90deg, var(--text-primary), var(--accent-color));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  `;
  
  // 4. 小鸟容器基础样式（定位到文字末尾）
  const BirdContainer = styled.div`
    position: absolute;
    top: -6px; // 调整垂直位置
    width: 28px;
    height: 24px;
    left: 100%; // 先固定在文字末尾（后续动态计算宽度）
  `;
  
  // 更新组件结构：用样式组件替换原生标签
  const AnimatedLogo: React.FC = () => {
    const fullText = 'welcome to zzz blog';
    return (
      <LogoContainer to="/">
        <ContentWrapper>
          <Text>{fullText}</Text>
          <BirdContainer>
            <SvgBird />
          </BirdContainer>
        </ContentWrapper>
      </LogoContainer>
    );
  };
  ```

  

+ 然后完善SVG小鸟的图形模板

  ```ts
  const SvgBird: React.FC = () => (
    <svg width="100%" height="100%" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 1. 身体（基础形状） */}
      <ellipse cx="14" cy="13" rx="7" ry="5.5" fill="var(--accent-color)" />
      {/* 2. 头部 */}
      <circle cx="7" cy="10" r="4.5" fill="var(--accent-color)" />
      {/* 3. 嘴巴 */}
      <path d="M 3 10 L 1 10.5 L 3 11 Z" fill="#ff9800" />
      {/* 4. 眼睛 */}
      <circle cx="7" cy="9" r="1.2" fill="#fff" />
      <circle cx="7" cy="9" r="0.7" fill="#000" />
      {/* 5. 翅膀（加类名，后续绑动画） */}
      <ellipse className="bird-wing" cx="12" cy="13" rx="5" ry="7" fill="var(--accent-color)" />
      {/* 6. 尾巴（加类名，后续绑动画） */}
      <g className="bird-tail">
        <ellipse cx="22" cy="12" rx="3" ry="1.5" fill="var(--accent-color)" />
      </g>
      {/* 7. 脚 */}
      <line x1="12" y1="18" x2="12" y2="20" stroke="#ff9800" strokeWidth="1.2" />
    </svg>
  );
  ```

+ 补充样式以及状态与交互逻辑

  ```tsx
  // 第三步：补充状态和交互框架（先定义变量，再写逻辑）
  import { useState, useEffect, useRef } from 'react';
  
  const AnimatedLogo: React.FC = () => {
    // 1. 定义核心状态（先声明，后续赋值逻辑）
    const [displayedChars, setDisplayedChars] = useState(0); // 已显示字符数
    const [isJumping, setIsJumping] = useState(false); // 小鸟是否飞行
    const [isFinished, setIsFinished] = useState(false); // 动画是否完成
    const [birdPosition, setBirdPosition] = useState(0); // 小鸟位置
    const contentRef = useRef<HTMLSpanElement>(null); // 文字容器ref
    const fullText = 'welcome to zzz blog';
  
    // 2. 定义交互函数框架（先声明，后续写逻辑）
    // 文字逐字显示逻辑（后续补充定时器）
    useEffect(() => {}, [displayedChars]);
    // 小鸟位置计算逻辑（后续补充ref获取宽度）
    useEffect(() => {}, [displayedChars]);
    // 动画完成逻辑（后续补充状态切换）
    useEffect(() => {}, [displayedChars, isFinished]);
  
    // 3. 处理显示的文字（基于displayedChars截取）
    const displayedText = fullText.substring(0, displayedChars);
  
    return (
      <LogoContainer to="/">
        <ContentWrapper ref={contentRef}>
          <Text>{displayedText}</Text>
          {/* 小鸟容器绑定状态（后续加动画） */}
          <BirdContainer 
            isJumping={isJumping} 
            isFinished={isFinished} 
            style={{ left: `${birdPosition}px` }}
          >
            <SvgBird />
          </BirdContainer>
        </ContentWrapper>
      </LogoContainer>
    );
  };
  ```

+ 补充实现细节，动画以及逻辑

  ```tsx
  // 补充动画关键帧（先定义，再绑定到样式）
  import { keyframes, css } from '@emotion/react';
  
  // 1. 定义关键帧动画
  const birdFly = keyframes`/* 飞行动画细节 */`;
  const birdLand = keyframes`/* 着陆动画细节 */`;
  const wingFlap = keyframes`/* 翅膀动画细节 */`;
  const Text = styled.span`
    // 补充文字渐变动画
    animation: gradientShift 4s ease-in-out infinite;
    @keyframes gradientShift { /* 渐变动画细节 */ }
  `;
  
  // 2. 给小鸟容器绑定动画逻辑（基于isJumping/isFinished）
  const BirdContainer = styled.div<{ isJumping: boolean; isFinished: boolean }>`
    /* 基础样式 */
    // 飞行状态动画（后续补充条件判断）
    ${(props) => props.isJumping && css``}
    // 完成状态动画（后续补充条件判断）
    ${(props) => props.isFinished && css``}
  `;
  
  ```

  注意： 对于styled-components库，使用模板字符串实现动态样式，获取组件的props需要使用函数，因为`styled-components` 会监听函数中使用的 props 变化。当 props 改变时（比如 `isJumping` 从 `false` 变成 `true`），模板渲染函数会重新执行，样式也会自动更新。

  ```tsx
  // 文字逐字显示逻辑
  useEffect(() => {
    if (displayedChars < fullText.length) {
      const timeout = setTimeout(() => {
        setIsJumping(true);
        setTimeout(() => setDisplayedChars(prev => prev + 1), 100);
        setTimeout(() => setIsJumping(false), 200);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [displayedChars]);
  
  // 小鸟位置计算逻辑
  useEffect(() => {
    if (contentRef.current) {
      setBirdPosition(contentRef.current.offsetWidth);
    }
  }, [displayedChars]);
  ```

  > 注：useEffect用于处理副作用操作，通过依赖数组来控制副作用的执行时机（首次渲染，依赖变化是，组件卸载时）；请注意清理函数的重要性，对于订阅，定时器、时间监听等操作，必须在清理函数中取消，否则可能导致内存泄漏

完整代码如下：

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

// 小鸟飞行动画（轻微上下浮动）
const birdFly = keyframes`
  0%, 100% {
    transform: translateY(0) scaleX(-1);
  }
  50% {
    transform: translateY(-4px) scaleX(-1);
  }
`;

// 小鸟飞到末尾并转身
const birdLand = keyframes`
  0% {
    transform: scaleX(-1);
  }
  50% {
    transform: scaleX(-1) translateY(-3px);
  }
  100% {
    transform: scaleX(1); /* 转身朝向左边 */
  }
`;

// 翅膀扇动动画
const wingFlap = keyframes`
  0%, 100% {
    transform: rotateY(0deg) rotateZ(-10deg);
  }
  50% {
    transform: rotateY(-30deg) rotateZ(-30deg);
  }
`;

// 尾巴摇动
const tailWag = keyframes`
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(15deg);
  }
`;

// 小鸟上下浮动
const birdFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`;

// 小鸟容器
const BirdContainer = styled.div<{ isJumping: boolean; isFinished: boolean }>`
  position: absolute;
  top: -6px; /* 小鸟在文字旁边，而不是上方 */
  width: 28px;
  height: 24px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  animation: ${(props) => (props.isJumping ? birdFly : props.isFinished ? birdLand : 'none')} 0.4s ease;
  animation-fill-mode: forwards;
  transform: ${(props) => (props.isFinished ? 'scaleX(1)' : 'scaleX(-1)')};
  transition: left 0.3s ease;
  z-index: 10;

  /* 飞行时启动翅膀动画 */
  ${(props) =>
    props.isJumping &&
    css`
      animation: ${birdFly} 0.4s ease-in-out infinite;

      .bird-wing {
        animation: ${wingFlap} 0.2s ease-in-out infinite;
      }
    `}

  /* 完成后启动待机动画 */
  ${(props) =>
    props.isFinished &&
    css`
      animation:
        ${birdLand} 0.4s ease forwards,
        ${birdFloat} 1.5s ease-in-out 0.4s infinite;

      .bird-wing {
        animation: ${wingFlap} 0.6s ease-in-out infinite;
      }
      .bird-tail {
        animation: ${tailWag} 1s ease-in-out infinite;
      }
    `}

  @media (max-width: 480px) {
    width: 24px;
    height: 20px;
    top: -4px;
  }
`;

// Logo 容器
const LogoContainer = styled(Link)`
  display: inline-flex;
  align-items: center;
  position: relative;
  text-decoration: none;
  padding: 0.6rem 1rem;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: 1.5rem;
  line-height: 1.5;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
    font-size: 1.2rem;
  }
`;

// 内容容器 - 用于测量宽度
const ContentWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  z-index: 100;
`;

// 文字内容
const Text = styled.span`
  font-weight: 400;
  position: relative;
  text-transform: lowercase;
  letter-spacing: 0.05em;

  /* 横向渐变色 - 使用主题色 */
  background: linear-gradient(90deg, var(--text-primary) 0%, var(--accent-color) 50%, var(--text-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;

  /* 渐变流动动画 */
  animation: gradientShift 4s ease-in-out infinite;

  @keyframes gradientShift {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`;

interface AnimatedLogoProps {
  className?: string;
}

// SVG 小鸟组件
const SvgBird: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 身体 */}
    <ellipse cx="14" cy="13" rx="7" ry="5.5" fill="var(--accent-color, #667eea)" />

    {/* 头部 */}
    <circle cx="7" cy="10" r="4.5" fill="var(--accent-color, #667eea)" />

    {/* 嘴巴 */}
    <path d="M 3 10 L 1 10.5 L 3 11 Z" fill="#ff9800" />

    {/* 眼睛 */}
    <circle cx="7" cy="9" r="1.2" fill="#fff" />
    <circle cx="7" cy="9" r="0.7" fill="#000" />

    {/* 翅膀（左） */}
    <ellipse
      className="bird-wing"
      cx="12"
      cy="13"
      rx="5"
      ry="7"
      fill="var(--accent-color, #667eea)"
      opacity="0.9"
      style={{ transformOrigin: '12px 13px' }}
    />

    {/* 翅膀装饰线 */}
    <path
      className="bird-wing"
      d="M 12 10 Q 14 13 12 16"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1"
      fill="none"
      style={{ transformOrigin: '12px 13px' }}
    />

    {/* 尾巴羽毛 */}
    <g className="bird-tail" style={{ transformOrigin: '20px 14px' }}>
      <ellipse cx="22" cy="12" rx="3" ry="1.5" fill="var(--accent-color, #667eea)" opacity="0.8" />
      <ellipse cx="22" cy="14" rx="3.5" ry="1.8" fill="var(--accent-color, #667eea)" opacity="0.8" />
      <ellipse cx="22" cy="16" rx="3" ry="1.5" fill="var(--accent-color, #667eea)" opacity="0.8" />
    </g>

    {/* 小脚 */}
    <line x1="12" y1="18" x2="12" y2="20" stroke="#ff9800" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="16" y1="18" x2="16" y2="20" stroke="#ff9800" strokeWidth="1.2" strokeLinecap="round" />

    {/* 脚趾 */}
    <path d="M 10.5 20 L 12 20 L 13.5 20" stroke="#ff9800" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    <path d="M 14.5 20 L 16 20 L 17.5 20" stroke="#ff9800" strokeWidth="0.8" strokeLinecap="round" fill="none" />
  </svg>
);

const AnimatedLogo: React.FC<AnimatedLogoProps> = () => {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const contentRef = useRef<HTMLSpanElement>(null);
  const [birdPosition, setBirdPosition] = useState(0);

  // 只显示 adnaan
  const fullText = 'welcome to zzz blog';

  // 小鸟飞行显示字符效果
  useEffect(() => {
    if (displayedChars < fullText.length) {
      const timeout = setTimeout(() => {
        // 开始飞行
        setIsJumping(true);

        // 飞行动画持续200ms，在100ms时显示字符
        setTimeout(() => {
          setDisplayedChars((prev) => prev + 1);
        }, 100);

        // 200ms后结束飞行状态
        setTimeout(() => {
          setIsJumping(false);
        }, 200);
      }, 200); // 每个字符间隔400ms，更快更流畅

      return () => clearTimeout(timeout);
    } else if (displayedChars === fullText.length && !isFinished) {
      // 所有字符显示完成后，延迟一下再触发降落的动画
      const finishTimeout = setTimeout(() => {
        setIsFinished(true);
      }, 200);

      return () => clearTimeout(finishTimeout);
    }
  }, [displayedChars, fullText.length, isFinished]);

  // 更新小鸟位置
  useEffect(() => {
    if (contentRef.current) {
      const width = contentRef.current.offsetWidth;
      setBirdPosition(width);
    }
  }, [displayedChars]);

  // 显示的文字内容
  const displayedText = fullText.substring(0, displayedChars);

  return (
    <LogoContainer to="/">
      <ContentWrapper ref={contentRef}>
        <Text>{displayedText}</Text>
        <BirdContainer isJumping={isJumping} isFinished={isFinished} style={{ left: `${birdPosition}px` }}>
          <SvgBird />
        </BirdContainer>
      </ContentWrapper>
    </LogoContainer>
  );
};

export default AnimatedLogo;

```

## 2.2  导航栏部分

导航栏部分，包含：

+ 普通导航项（不支持点击出现下拉框，支持点击跳转路由）
+ 下拉菜单项（点击展示下拉项，点击下拉项进行跳转）
+ 导航项需要根据当前路由激活高亮
+ 下拉菜单可以点击展开/关闭,点击菜单项之后自动关闭

基于需求，设计顶层组件结构：

```plaintext
Header（父组件）
├─ AnimatedLogo（Logo组件）
└─ NavLinks（导航链接组件，子组件）
   ├─ 普通导航项（NavLinkWithHover）
   └─ 下拉菜单（DropdownContent + DropdownItem）
```

所以先设计顶层UI布局在`Header`组件中

```tsx
return (
  <div className="header">
    <HeaderContainer>
      {/* Logo组件 */}
      <AnimatedLogo />
      {/* 导航链接组件（传递数据和状态） */}
      <div className="nav-card">
        <NavLinks />
      </div>
    </HeaderContainer>
  </div>
);
```

设计子组件（NavLinks）作为 “展示组件”，需要明确从父组件接收哪些参数，首先我们需要将导航栏数据源传递给子组件进行渲染，那么先定义导航项的接口规范，其中需要包括：

```tsx
interface MainItem {
  title: string; // 导航项名称
  path: string; // 路由跳转路径
  icon?: React.ReactNode; // 导航项图标
  isDropdown?: boolean; // 是否支持下拉
  // 子菜单
  children?: MainItem[]; 
}
```

然后对于支持下拉框的导航项，需要定义其状态是否展开或者关闭，即`moreDropdownOpen`，同时我们需要再Header中定义点击处理事件`toggleMoreDropdown`，更改其状态，其次当我们点击不支持下拉的导航项时，我们同时也应该处理如果展开下拉框再点击其他导航项的情况，即`onLinkClick`

因此先定义其 props 类型：

```tsx
// 导航组件接收的参数
interface NavLinksProps {
  mainNavItems: MainItem[];             // 导航数据源
  onLinkClick: () => void;              // 点击导航项的回调
  moreDropdownOpen: boolean;            // 下拉菜单状态
  toggleMoreDropdown: (e: React.MouseEvent) => void; // 切换下拉菜单的回调
}
```

开发`NavLinks`, 首先导航链接项也是基于`react-router-dom`的`Link`封装，支持动态激活状态（颜色、字体粗细、图标显示）：

```tsx
const NavLink = styled(Link)<{ active: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 0.75rem;
  color: ${props => props.active === 'true' ? 'var(--accent-color)' : 'var(--text-secondary)'};
  font-weight: ${props => props.active === 'true' ? '600' : '500'};
  transition: all 0.3s ease;

  svg {
    opacity: ${props => props.active === 'true' ? '1' : '0'};
    transition: opacity 0.2s ease;
  }

  &:hover {
    color: var(--accent-color);
    svg { opacity: 0.5; }
  }
`;
```

下拉菜单样式（`DropdownContent`和`DropdownItem`）

- `DropdownContent`：下拉容器，绝对定位，带阴影和圆角

- `DropdownItem`：下拉菜单项，基于`Link`封装，hover 时有背景色变化

  ```tsx
  // 下拉容器
  const DropdownContent = styled.div`
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    width: 220px;
    background: var(--bg-primary);
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 100;
  `;
  
  // 下拉菜单项
  const DropdownItem = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    color: var(--text-secondary);
    &:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }
  `;
  ```

  

接下来	实现`NavLinks`的核心渲染逻辑

遍历父组件传递过来的`mainNavItems`，根据导航项类型（普通项 / 下拉菜单）渲染不同结构：

- 普通项：直接渲染`NavLinkWithHover`
- 下拉菜单：渲染触发按钮 + 条件显示下拉内容（`DropdownContent`）

```tsx
 return (
    <>
      {mainNavItems.map((item) => { // 遍历导航项
        if (item.isDropdown && item.children) {
          return (
            /* 下拉菜单的外层容器，为下拉内容提供参考定位点 */
            <div key={item.path} style={{ position: 'relative' }}>
              <NavLink
                to='#'
                active={`${isItemActive(item)}`}
                onClick={(e) => {
                  e.stopPropagation(); //阻止事件的默认行为，默认会滚动到页面顶部
                  toggleMoreDropdown(e); //切换更多下拉菜单的显示状态
                }}
              >
                {item.icon}
                {item.title}
              </NavLink>
              {/* 下拉菜单内容 */}
              {moreDropdownOpen && (
                <DropdownContent>
                  {
                    item.children.map((child) => (
                      <DropdownItem key={child.path} to={child.path} onClick={onLinkClick}>
                        {child.icon}
                        {child.title}
                      </DropdownItem>
                    ))
                  }
                </DropdownContent>
              )}
            </div>
          )
        } else { // 普通菜单
          return (
            <NavLink key={item.path} to={item.path} active={`${isItemActive(item)}`} onClick={onLinkClick}>
              {item.icon}
              {item.title}
            </NavLink>
          )
        }
      })}
```

其中，路由激活状态的判断逻辑，使用`useLocation`获取当前路径，判断导航项是否处于激活状态：

- 首页（`/`）：精确匹配
- 普通项：当前路径包含导航项路径（如`/blog/123`包含`/blog`）
- 下拉菜单：子项中任意一项的路径被当前路径包含

```tsx
const NavLinks: React.FC<NavLinksProps> = ({
  mainNavItems, onLinkClick, moreDropdownOpen, toggleMoreDropdown
}) => {
  const location = useLocation(); // 获取当前路由路径

  // 判断导航项是否激活
  const isItemActive = (item: MainItem) => {
    if (item.path === '/') return location.pathname === item.path;
    if (item.isDropdown && item.children) {
      return item.children.some(child => location.pathname.includes(child.path));
    }
    return location.pathname.includes(item.path);
  };

  // ... 渲染逻辑
};
```

## 2.3 切换主题

在导航栏中添加一个切换主题的按钮，所以创建一个`ThemeToggle`组件，其中包括一个按钮（展示为图标）点击进行主题切换

```tsx
import { useState } from "react";
const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState('light');
    return (
        <div>
           <button>
            {theme === 'light' ? '切换到深色主题' : '切换到浅色主题'}
           </button>
        </div>
    )
}
export default ThemeToggle;
```

但是考虑到多组件共享主题状态（如 `Header`、`Card`、`Footer`）需要根据当前主题调整样式（例如暗模式下文字变白色、背景变深色）。如果主题状态只存在于 `ThemeToggle` 组件中，其他组件无法直接获取该状态。

- 若通过「props 层层传递」将 `theme` 传给子组件，当组件层级较深时（如 `App → Header → Nav → Logo`），会出现「props 透传地狱」，代码冗余且难维护；
- 若用「Context 共享」，虽然能解决透传问题，但 Context 不擅长处理「频繁更新的状态」（主题切换会导致所有消费 Context 的组件重新渲染，可能影响性能），且无法直接处理「持久化存储」「系统主题监听」等副作用逻辑。

因此，主题状态需要持久化和系统适配，所以采用Redux store进行管理，Redux Store 是「单一数据源」，`theme` 状态存储在 Store 中后，应用中任何组件（`ThemeToggle`、`Header`、`Card` 等）都能通过 `useSelector` 直接获取，无需 props 传递：

1. 刷新页面后，保留用户之前选择的主题（持久化，需要结合localStorage）；
2. 首次打开应用时，自动跟随系统的明暗模式偏好；
3. 当系统主题切换时（如用户在设置中改了系统主题），应用自动同步。

本项目采用Redux Toolkit，它是 Redux 官方推荐的「标准工具集」，内置了 `configureStore`、`createSlice`、`createAsyncThunk` 等 API，且集成了`Immer`库，允许直接修改`state` （本质是Immer帮我们生成了新对象）。直接解决原生 Redux 的痛点：配置繁琐，代码冗余

整个流程

1.  先定义 reducer 规则（告诉 Redux 怎么改状态）
2.  把规则挂到 Store（让 Store 认规则）
3.  用户操作触发 dispatch（发 Action 申请）
4.  Store 调用 reducer 改状态（按规则更新）
5.  组件读新状态重新渲染（UI 同步更新）。

接下来，导入依赖:

```powershell
# Redux核心：@reduxjs/toolkit（简化Redux配置）+ react-redux（React绑定）
npm install @reduxjs/toolkit react-redux
```

然后创建src/store/index.ts 进行store配置，同时配置与Theme相关的reducer

```ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from 'react-redux';
import themeReducer from './modules/themeSlice';
// 配置store: 配置store的初始状态和reducer函数
const store = configureStore({
    // 配置reducer键值对,给状态 “分区” 并指定每个分区的管理规则
    reducer: {
        // 配置theme状态的管理规则,使用themeReducer处理theme相关的action
        theme: themeReducer,
    }
    // 配置middleware
});
// 从 store 中推断出 RootState 类型
export type RootState = ReturnType<typeof store.getState>;
// 从 store 中推断出 AppDispatch 类型
export type AppDispatch = typeof store.dispatch;

// 创建类型安全的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
```

然后创建对应的`themeSlice.ts`，定义状态结构，写状态修改规则, 用 `createSlice` 定义这个模块的「状态修改逻辑」，

​	**关键细节**：

- `name`：不能和其他 slice 重复，否则 Action 会冲突（比如两个 slice 都叫 `theme`，会生成相同的 `theme/setTheme`）；
- `reducers` 里的每个函数都是 “修改规则”，只能通过 `dispatch` 触发，不能直接调用；
- `action: PayloadAction<Theme>`：约束外部传值的类型，确保传的是 `light` 或 `dark`

`createSlice` 会自动把 `reducers` 里的函数转成「可调用的 Action」，组件通过 `dispatch(Action())` 触发状态修改，比如

- 接收 `Action`（比如 `{ type: 'theme/setTheme', payload: 'dark' }`）；
- 根据 Action 的 `type`（比如 `theme/setTheme`），找到对应的规则（`setTheme` 函数）并执行；
- 最后返回新的状态（Immer 帮你处理了不可变）。

```ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { storage } from "@/utils";
// 定义主题类型 只能是 light 或 dark（限制取值，避免传 'red' 这种非法值）
type Theme = 'light' | 'dark';
interface ThemeState {
    theme: Theme; // 这个 slice 只管理一个主题字段（单一职责）
}
// 同步主题到页面Dom
const applyTheme = (theme: Theme) => {
    // 检查当前环境是否有document对象，document是浏览器环境特有的，服务端环境没有document对象
    if (typeof document === 'undefined') return;
    // 1. 设置data-theme属性（相当于给<html>元素添加一个自定义属性）后续通过css选择器[data-theme]来切换主题
    document.documentElement.setAttribute('data-theme', theme);
    // 2. 同步更新到 localStorage,防止刷新后丢失主题
    storage.local.set('theme', theme);
};

// 定义初始状态
const initialState: ThemeState = {
    theme: 'light',
};
// 创建slice，封装主题的修改逻辑
const themeSlice = createSlice({
    name: 'theme', // 切片名称，用于在全局状态中标识该切片的状态,不能和其他slice重复
    initialState,
    reducers: {
        // 1. 设置主题（支持外部传入）
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            // 2. 同步更新到 localStorage,防止刷新后丢失主题
            applyTheme(action.payload);
        },
        // 2. 切换主题
        toggleTheme: (state) => {
            // 1. 切换主题
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            // 2. 同步更新到 localStorage,防止刷新后丢失主题
            applyTheme(state.theme);
        }
    }
});
export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
```

