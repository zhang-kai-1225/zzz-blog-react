import { lazy } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

// 异步加载组件
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const Home = lazy(() => import('@/pages/index/home'));
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
        element: <Home />,
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