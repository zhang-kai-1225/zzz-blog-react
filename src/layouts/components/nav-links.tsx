import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
// 导航菜单接口定义
interface MainItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  isDropdown?: boolean;
  isInternal?: boolean;
  // 子菜单
  children?: MainItem[];
}
// 导航栏props
interface NavLinksProps {
  mainNavItems: MainItem[];
  onLinkClick: () => void;
  moreDropdownOpen: boolean;
  toggleMoreDropdown: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

const NavLink = styled(Link) <{ active: string }>`
  position: relative;
  display: flex;
  align-items: center;
  gap:8px;
  padding: 0.5rem 0.75rem;
  margin: 0 0.5rem;
  font-size: 0.95rem;
  font-weight: ${(props) => props.active === 'true' ? '600' : '500'};
  color: ${(props) => props.active === 'true' ? 'var(--accent-color)' : 'var(--text-secondary)'};
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 8px;
  white-space: nowrap;
    &:hover {
    color: var(--accent-color);
  }
  svg {
    opacity: ${(props) => (props.active === 'true' ? '1' : '0')};
    /* 图标显示/隐藏的过渡动画：0.2s 平滑变化 */
    transition: opacity 0.2s ease;
  }
  &:hover svg {
    opacity: 0.5; 
  }
`
// 下拉菜单
const DropdownContent = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem); // 100% 表示与父容器的底部对齐，+ 0.5rem 表示在父容器底部下方再留出 
  right: 0;
  width: 220px;
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

`
// 下拉菜单项
const DropdownItem = styled(Link)`
  display: flex; 
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  transition: all 0.2 ease;
  gap:0.5rem;
  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`
const NavLinks: React.FC<NavLinksProps> = ({
  mainNavItems,
  onLinkClick,
  moreDropdownOpen,
  toggleMoreDropdown,
}) => {
  const location = useLocation();
  // 检查当前路径是否与导航项路径匹配
  const isItemActive = (item: MainItem) => {
    if (item.path === '/') {
      return location.pathname === item.path;
    }
    if (item.isDropdown && item.children) {
      return item.children.some(child => location.pathname.includes(child.path));
    }
    return location.pathname.includes(item.path);
  };
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
    </>
  )
}
export default NavLinks;