import React, { useState } from 'react';
import { FiHome, FiBookOpen, FiEdit, FiCode, FiInfo, FiMail } from 'react-icons/fi';
import styled from '@emotion/styled';
import AnimatedLogo from '@/layouts/components/animated-logo';
import NavLinks from '@/layouts/components/nav-links';
import ThemeToggle from '@/layouts/components/theme-toggle';

// Header组件接口定义
interface HeaderProps {
  scrolled?: boolean;
}
// 导航菜单接口定义
interface MainItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  isDropdown?: boolean;
  // 子菜单
  children?: MainItem[];
}
// 头部容器
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  width: 100vw;
  padding: 0 5rem;
`;
const Header: React.FC<HeaderProps> = () => {
  // 导航菜单
  const mainNavItems: MainItem[] = [
    {
      path: '/',
      title: '首页',
      icon: <FiHome size={16} />,
    },
    {
      path: '/blog',
      title: '文稿',
      icon: <FiBookOpen size={16} />,
    },
    {
      path: '/notes',
      title: '笔记',
      icon: <FiEdit size={16} />,
    },
    {
      path: '/projects',
      title: '项目',
      icon: <FiCode size={16} />,
    },
    {
      path: '#',
      title: '更多',
      icon: <FiInfo size={16} />,
      isDropdown: true,
      children: [
        {
          path: '/code',
          title: '开发字体',
          icon: <FiCode size={16} />,
        },
        {
          path: '/about',
          title: '关于我',
          icon: <FiInfo size={16} />,
        },
        {
          path: '/contact',
          title: '联系方式',
          icon: <FiMail size={16} />,
        },
      ],
    },
  ];
  // 更多下拉菜单状态管理
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  // 切换更多下拉菜单显示状态
  const toggleMoreDropdown = (e?: React.MouseEvent<Element, MouseEvent>) => {
    e?.stopPropagation();
    setMoreDropdownOpen(!moreDropdownOpen);
    console.log('moreDropdownOpen', moreDropdownOpen);
  };
  // 处理导航链接点击事件,点击非更多导航链接关闭更多下拉菜单的显示  
  const handleLinkClick = () => {
    setMoreDropdownOpen(false);
  };

  return (
    <div className={`header`}>
      <HeaderContainer>
        {/* Logo */}
        <AnimatedLogo>
        </AnimatedLogo>
        {/* 导航栏 */}
        <div className='nav-card'>
          <NavLinks
            mainNavItems={mainNavItems}
            onLinkClick={handleLinkClick}
            moreDropdownOpen={moreDropdownOpen}
            toggleMoreDropdown={toggleMoreDropdown}
          >
          </NavLinks>
          {/*桌面端的主题切换按钮和用户头像点击登录 */}
          {/* 主题切换按钮 */}
          <ThemeToggle />
          {/* 用户登录 */}
          {/* <UserLogin /> */}
        </div>
      </HeaderContainer>
    </div>
  )

}
export default Header;