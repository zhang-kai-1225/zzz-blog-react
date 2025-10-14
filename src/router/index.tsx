import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {lazy} from 'react';

// 异步加载组件
const HomePage = lazy(() => import('@/pages/HomePage'));
const ArticlesPage = lazy(() => import('@/pages/ArticlesPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const MainLayout = lazy(() => import('@/layouts/MainLayout'));



// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'articles',
        element: <ArticlesPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
]);

// 路由提供者组件
export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default router;
