import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

// 头部容器
const HeaderContainer = styled.header`
  background-color: ${theme.colors.backgroundDark};
  color: ${theme.colors.textInverse};
  padding: ${theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.sticky};
  box-shadow: ${theme.shadows.sm};
`;

// 头部内容包装器
const HeaderWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md};
  }
`;

// Logo/标题
const Logo = styled(Link)`
  font-size: ${theme.fontSize['2xl']};
  font-weight: 700;
  color: ${theme.colors.textInverse};
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${theme.colors.primary};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSize.xl};
  }
`;

// 导航容器
const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

// 导航列表
const NavList = styled.ul`
  display: flex;
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: ${props => props.className?.includes('mobile-open') ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${theme.colors.backgroundDark};
    flex-direction: column;
    padding: ${theme.spacing.md};
    box-shadow: ${theme.shadows.md};
    gap: ${theme.spacing.md};
  }
`;

// 导航项
const NavItem = styled.li``;

// 导航链接 - 使用React Router的NavLink并应用样式
const NavLink = styled(Link)`
  color: ${theme.colors.textLight};
  text-decoration: none;
  font-size: ${theme.fontSize.base};
  font-weight: 500;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: ${theme.colors.textInverse};
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

// 移动端菜单按钮
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.textInverse};
  font-size: ${theme.fontSize.xl};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

// 导航菜单数据
const navItems = [
  { path: '/', label: '首页' },
  { path: '/articles', label: '文章' },
  { path: '/categories', label: '分类' },
  { path: '/about', label: '关于' },
];

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <Logo to="/">ZZZ Blog</Logo>
        
        <Nav>
          <NavList className={isMobileMenuOpen ? 'mobile-open' : ''}>
            {navItems.map((item) => (
              <NavItem key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: location.pathname === item.path ? theme.colors.primary : undefined,
                    backgroundColor: location.pathname === item.path ? 'rgba(100, 108, 255, 0.1)' : undefined
                  }}
                >
                  {item.label}
                </NavLink>
              </NavItem>
            ))}
          </NavList>
          
          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </MobileMenuButton>
        </Nav>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

export default Header;
