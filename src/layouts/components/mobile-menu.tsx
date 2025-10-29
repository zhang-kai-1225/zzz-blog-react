import type { RootState } from "@/store";
import { getRoleColor, getRoleDisplayName } from "@/utils/role-helper";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
// 定义菜单项接口
interface MenuItem {
    path: string;
    title: string;
    icon: React.ReactNode;
    isExternal?: boolean;
    isDropdown?: boolean;
    children?: MenuItem[];
}

interface MenuGroup {
    title: string;
    items: MenuItem[];
}

interface MobileMenuProps {
    isOpen: boolean;
    menuGroups: MenuGroup[];
    accountItems?: MenuItem[];
    onLinkClick: () => void;
    handleLogin?: () => void;
    handleRegister?: () => void;
    handleLogout?: () => void;
}
// 移动端菜单容器
const MobileMenuContainer = styled(motion.div)`
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: var(--bg-primary);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    touch-action: none;
`;
// 移动端菜单内容
const MobileMenuContent = styled.div`
   flex: 1;
   overflow-y: auto;
   padding: 1rem;
   margin-top: calc(var(--header-height) + 1rem);
   -webkit-overflow-scrolling: touch;
   overscroll-behavior: contain;

   &::-webkit-scrollbar {
       display: none;
   }
`;
// 移动端菜单分隔线
const MobileMenuDivider = styled.hr`
    height: 1px;
    background: var(--border-color);
    margin: 1rem 0;
`;
// 移动端菜单分组
const MobileMenuSection = styled.div`
    margin-bottom: 1.5rem;
    &:last-child {
    margin-bottom: 0;
  }
`;
// 移动端菜单分组标题
const MobileMenuTitle = styled.h3`
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    padding: 0 0.5rem;
`;
// 移动端菜单导航链接
const MobileNavLink = styled(Link) <{ active: string }>`
    display:flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    margin: 0.25rem 0;
    font-size: 1rem;
    font-weight: ${(props) => (props.active === 'true' ? '600' : '500')};
    color: ${(props) => (props.active === 'true' ? 'var(--text-primary)' : 'var(--text-secondary)')};
    border-radius: 0.5rem;
    gap: 0.75rem;
    transition: all 0.2s ease;  
    &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }

    svg {
        font-size: 1.25rem;
        opacity: ${(props) => (props.active === 'true' ? '1' : '0.7')};
        transition: opacity 0.2s ease;
    }

`;
// 定义动画变体
export const mobileMenuVariants = {
    hidden: { x: '100%' },
    visible: {
        x: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1] as any,
        },
    },
    exit: {
        x: '100%',
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 1, 1] as any,
        },
    },
};
const MobileAuthButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 0.75rem 0.5rem;
  margin: 0.25rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.75rem;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  svg {
    font-size: 1.25rem;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
`;

const MobileMenu: React.FC<MobileMenuProps> = (
    {
        isOpen,
        menuGroups,
        accountItems,
        onLinkClick,
        handleLogin,
        handleRegister,
        handleLogout,
    }
) => {
    const location = useLocation();
    const { isLoggedIn, user } = useSelector((state: RootState) => state.user);

    // 处理特殊路径的点击（如登录和注册）
    const handleSpecialPathClick = (path: string) => {

    };
    if (!isOpen) return null;
    return (
        <>
            <MobileMenuContainer initial="hidden" animate="visible" exit="hidden" variants={mobileMenuVariants}>
                <MobileMenuContent>
                    {/** 移动端菜单导航 */}
                    {menuGroups.map((group, groupIndex) => (
                        <React.Fragment key={group.title}>
                            {groupIndex > 0 && <MobileMenuDivider />}
                            <MobileMenuSection>
                                <MobileMenuTitle>{group.title}</MobileMenuTitle>
                                {group.items.map((item) => {
                                    if (item.isDropdown && item.children && item.children.length > 0) {
                                        return (
                                            <React.Fragment key={item.path}>
                                                <MobileNavLink active='false' to='#' onClick={() => { }}>
                                                    {item.icon}
                                                    {item.title}
                                                </MobileNavLink>
                                                <div style={{ paddingLeft: '1.5rem' }}>
                                                    {
                                                        item.children.map((childItem) => {
                                                            return (
                                                                <MobileNavLink
                                                                    key={childItem.path}
                                                                    to={childItem.path}
                                                                    active={(
                                                                        location.pathname === childItem.path ||
                                                                        (childItem.path !== '/' && location.pathname.includes(childItem.path))
                                                                    ).toString()}
                                                                    onClick={() => handleSpecialPathClick(childItem.path)}
                                                                >
                                                                    {childItem.icon}
                                                                    {childItem.title}
                                                                </MobileNavLink>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </React.Fragment>
                                        )
                                    } else {
                                        return (
                                            <MobileNavLink key={item.path} to={item.isExternal || item.path.startsWith('#') ? '#' : item.path} active={
                                                location.pathname === item.path || (item.path !== '/' && location.pathname.includes(item.path))
                                                    ? 'true'
                                                    : 'false'
                                            }
                                                onClick={() =>
                                                    item.isExternal || item.path.startsWith('#') ? handleSpecialPathClick(item.path) : onLinkClick()
                                                }
                                            >
                                                {item.icon}
                                                {item.title}
                                            </MobileNavLink>
                                        )
                                    }


                                })}
                            </MobileMenuSection>
                        </React.Fragment>
                    ))}
                    {/**渲染账户菜单项 */}
                    <MobileMenuDivider />
                    <MobileMenuSection>
                        <MobileMenuTitle>账户</MobileMenuTitle>
                        {isLoggedIn ? (
                            <>
                                <div
                                    style={{
                                        padding: '0.75rem 0.5rem',
                                        margin: '0.25rem 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: user?.avatar ? '2px solid var(--accent-color-alpha)' : 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: user?.avatar ? 'transparent' : 'var(--bg-secondary)',
                                        }}
                                    >
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt="用户头像"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <FiUser size={18} color="var(--text-secondary)" />
                                        )}
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                color: 'var(--text-primary)',
                                            }}
                                        >
                                            {user?.username || '用户'}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.8rem',
                                                color: getRoleColor(user?.role),
                                                fontWeight: '500',
                                            }}
                                        >
                                            {getRoleDisplayName(user?.role)}
                                        </div>
                                    </div>
                                </div>
                                <MobileAuthButton
                                    onClick={() => {
                                        if (handleLogout) {
                                            handleLogout();
                                        }
                                        onLinkClick();
                                    }}
                                >
                                    <FiLogOut size={16} />
                                    退出登录
                                </MobileAuthButton>
                            </>
                        ) : (
                            // 未登录用户显示登录和注册
                            accountItems &&
                            accountItems.map((item) => (
                                <MobileAuthButton key={item.path} onClick={() => handleSpecialPathClick(item.path)}>
                                    {item.icon}
                                    {item.title}
                                </MobileAuthButton>
                            ))
                        )}
                    </MobileMenuSection>
                </MobileMenuContent>

            </MobileMenuContainer>
        </>
    )
}
export default MobileMenu;