import React, { useEffect, useRef, useState, type RefObject } from 'react';
import { FiHome, FiBookOpen, FiEdit, FiCode, FiInfo, FiMail, FiUser, FiX, FiMenu, FiLogIn, FiUserPlus } from 'react-icons/fi';
import styled from '@emotion/styled';
import AnimatedLogo from '@/layouts/components/animated-logo';
import NavLinks from '@/layouts/components/nav-links';
import ThemeToggle from '@/layouts/components/theme-toggle';
import UserMenu, { MobileAvatar } from '@/layouts/components/user-menu';
import { useDispatch, useSelector } from 'react-redux';
import MobileMenu from '@/layouts/components/mobile-menu';
import { logoutUser } from '@/store/modules/userSlice';
import type { AppDispatch } from '@/store';
import LoginModal from '@/layouts/components/login-modal';
import RegisterModal from './components/register-modal';



// Header组件接口定义
interface HeaderProps {
  scrolled?: boolean;
}
// 导航菜单接口定义
interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  isDropdown?: boolean;
  // 子菜单
  children?: MenuItem[];
}
// 移动端菜单分组接口定义
interface MenuGroup {
  title: string;
  items: MenuItem[];
}
// 头部容器
const HeaderContainer = styled.header<{ scrolled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  width: 100vw;
  padding: 0 5rem;
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

// 移动端菜单按钮样式
const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 60;

  @media (max-width: 768px) {
    display: flex;
  }
`;
// 导航菜单
const mainNavItems: MenuItem[] = [
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
// 定义基础移动端菜单分组数据
const getBaseMobileMenuGroups = (): MenuGroup[] => [
  {
    title: '主导航',
    items: mainNavItems,
  },
];
// 定义账户菜单项
const accountMenuItems: MenuItem[] = [
  {
    path: '#login',
    title: '登录',
    icon: <FiLogIn size={16} />,
  },
  {
    path: '#register',
    title: '注册',
    icon: <FiUserPlus size={16} />,
  },
];
const Header: React.FC<HeaderProps> = ({ scrolled = false }) => {


  // 更多下拉菜单状态管理
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  // 移动端菜单状态管理
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 用户下拉菜单状态管理
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  // 登录弹窗状态管理
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  // 注册弹窗状态管理
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  // 页面滚动状态管理
  const [internalScrolled, setInternalScrolled] = useState(scrolled);
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoggedIn } = useSelector((state: any) => state.user);

  // 导航栏DOM引用
  const navCardRef = useRef<HTMLDivElement>(null);
  // 更多下拉菜单DOM引用
  const dropdownRef = useRef<HTMLDivElement>(null);
  // 移动端菜单DOM引用
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  // 用户下拉菜单DOM引用
  const userDropdownRef = useRef<HTMLDivElement>(null);
  // RAF动画循环ID
  const rafRef = useRef<number | null>(null);
  // 切换更多下拉菜单显示状态
  const toggleMoreDropdown = (e?: React.MouseEvent<Element, MouseEvent>) => {
    e?.stopPropagation();
    setMoreDropdownOpen(!moreDropdownOpen);
  };
  // 切换用户下拉菜单显示状态
  const toggleUserDropdown = (e?: React.MouseEvent<Element, MouseEvent>) => {
    e?.stopPropagation();
    setUserDropdownOpen(!userDropdownOpen);
  };
  // 处理导航链接点击事件,点击非更多导航链接关闭更多下拉菜单的显示  
  const handleLinkClick = () => {
    setMoreDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };
  // 处理登录
  const handleLogin = () => {
    setLoginModalOpen(true);
    setUserDropdownOpen(false);
  };
  // 切换到注册
  const handleSwitchToRegister = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };
  // 切换到登录
  const handleSwitchToLogin = () => {
    setRegisterModalOpen(false);
    setLoginModalOpen(true);
  };



  // 处理注册
  const handleRegister = () => {
    setRegisterModalOpen(true);
    setUserDropdownOpen(false);
  };

  // 根据登录状态动态生成移动端菜单分组
  const mobileMenuGroups: MenuGroup[] = isLoggedIn
    ? [
      ...getBaseMobileMenuGroups(),
      {
        title: '用户中心',
        items: [
          {
            path: '/profile',
            title: '个人中心',
            icon: <FiUser size={16} />,
          },
        ],
      },
    ]
    : getBaseMobileMenuGroups();
  // 如果scrolled属性被传入， 则使用它，否则自行监听滚动
  useEffect(() => {
    // 如果没有传入scrolled属性， 则监听滚动事件
    if (!scrolled) {
      const handleScrolled = () => {
        if (window.scrollY > 0) {
          setInternalScrolled(true);
        } else {
          setInternalScrolled(false);
        }
      }
      window.addEventListener('scroll', handleScrolled);
      return () => {
        window.removeEventListener('scroll', handleScrolled);
      }
    }
  }, [scrolled])
  // 监听鼠标点击事件，如果点击了导航栏， 则关闭更多下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
        console.log('点击了更多导航链接');
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])
  // 高性能鼠标追随聚光灯效果
  useEffect(() => {
    const navCard = navCardRef.current;
    if (!navCard || internalScrolled) return;
    let mouseX = 0;
    let mouseY = 0;
    const updateSpotlight = () => {
      // 使用css变量更新位置，性能优于直接修改background
      navCard.style.setProperty('--spotlight-x', `${mouseX}px`);
      navCard.style.setProperty('--spotlight-y', `${mouseY}px`);
      // 重置RAF动画循环ID
      rafRef.current = null;
    }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = navCard.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      // console.log(mouseX, mouseY);
      // 如果RAF动画循环ID不存在，则创建一个新的循环ID 避免重复注册动画（用rafRef控制）
      if (!rafRef.current) {
        // requestAnimationFrame(updateSpotlight) 告诉浏览器：“下一帧渲染前执行 updateSpotlight 函数”，确保动画与浏览器重绘节奏同步（通常 60fps，每 16.6ms 一次），比 setTimeout 更流畅且省性能。
        rafRef.current = requestAnimationFrame(updateSpotlight);
      }
    };
    navCard.addEventListener('mousemove', handleMouseMove);
    return () => {
      navCard.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        // 取消RAF动画循环ID 避免内存泄漏
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
  }, [internalScrolled])
  return (
    <div className={`header ${internalScrolled ? 'scrolled' : ''}`}>
      <HeaderContainer scrolled={internalScrolled}>
        {/* Logo */}
        <AnimatedLogo>
        </AnimatedLogo>
        {/* 导航栏 */}
        <div className='nav-card' ref={navCardRef}>
          <NavLinks
            mainNavItems={mainNavItems}
            onLinkClick={handleLinkClick}
            moreDropdownOpen={moreDropdownOpen}
            toggleMoreDropdown={toggleMoreDropdown}
            dropdownRef={dropdownRef as RefObject<HTMLDivElement>}
          />
          {/*桌面端的主题切换按钮和用户头像点击登录 */}
          {/* 主题切换按钮 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeToggle />
            {/* 用户登录 */}
            <UserMenu
              toggleUserDropdown={toggleUserDropdown}
              userDropdownOpen={userDropdownOpen}
              handleLinkClick={handleLinkClick}
              userDropdownRef={userDropdownRef as RefObject<HTMLDivElement>}
              handleLogin={handleLogin}
              handleRegister={handleRegister}
            />
          </div>
        </div>
        {/** 移动端的主题切换按钮和用户头像点击登录 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MobileAvatar onClick={(e) => toggleUserDropdown(e)} hasImage={!!user?.avatar}>
            {isLoggedIn && user?.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <FiUser color='var(--text-secondary)' />
            )}
          </MobileAvatar>
          <MenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </MenuButton>
        </div>
      </HeaderContainer>
      {/** 移动端菜单 */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        menuGroups={mobileMenuGroups}
        accountItems={accountMenuItems}
        onLinkClick={handleLinkClick}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleLogout={() => {
          dispatch(logoutUser());
          handleLinkClick();
        }}
      />
      {/**登录和注册模态框 */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  )

}
export default Header;