import React, {useEffect, useRef, useState, type RefObject, useLayoutEffect, useMemo} from 'react';
import {
    FiHome,
    FiBookOpen,
    FiEdit,
    FiCode,
    FiInfo,
    FiMail,
    FiUser,
    FiX,
    FiMenu,
    FiLogIn,
    FiUserPlus, FiTag
} from 'react-icons/fi';
import styled from '@emotion/styled';
import AnimatedLogo from '@/layouts/components/animated-logo';
import NavLinks from '@/layouts/components/nav-links';
import ThemeToggle from '@/layouts/components/theme-toggle';
import UserMenu, {MobileAvatar} from '@/layouts/components/user-menu';
import {useDispatch, useSelector} from 'react-redux';
import MobileMenu from '@/layouts/components/mobile-menu';
import {logoutUser} from '@/store/modules/userSlice';
import type {AppDispatch} from '@/store';
import LoginModal from '@/layouts/components/login-modal';
import RegisterModal from './components/register-modal';
import {animate, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform} from 'framer-motion';
import {useAnimationEngine} from "@/utils/ui/animation";
import {useLocation} from "react-router-dom";

export interface PageInfo {
    title?: string;
    subtitle?: string; // 副标题
    tags?: (string | { id?: string | number; name?: string })[];
    category?: string;
}

// Header组件接口定义
interface HeaderProps {
    scrolled?: boolean;
    pageInfo?: PageInfo;
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
    width: 100%;
    padding: 0 5rem;
    @media (max-width: 768px) {
        padding: 0 1rem;
    }
`;
// 桌面导航容器
const DeskTopNavWrapper = styled.div`
    display: flex;
    margin-left: auto;
    @media (max-width: 768px) {
        display: none;
    }
`
// 桌面端页面信息样式
const PageInfoContainer = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: 2rem;
    padding-left: 2rem;
    border-left: 1px solid rgba(var(--accent-rgb), 0.15);
    /* 宽度由动画控制，防止内容溢出 */
    flex-shrink: 0;
    overflow: hidden;

    @media (max-width: 1024px) {
        display: none;
    }
`;

const PageTitle = styled.h1`
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const PageSubtitle = styled.p`
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--text-tertiary);
    margin: 0.25rem 0 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.8;
    line-height: 1.3;
`;

const TagsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
`;

const Tag = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.625rem;
    background: rgba(var(--accent-rgb), 0.1);
    color: var(--accent-color);
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;

    svg {
        font-size: 0.7rem;
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
        icon: <FiHome size={16}/>,
    },
    {
        path: '/blog',
        title: '文稿',
        icon: <FiBookOpen size={16}/>,
    },
    {
        path: '/notes',
        title: '笔记',
        icon: <FiEdit size={16}/>,
    },
    {
        path: '/projects',
        title: '项目',
        icon: <FiCode size={16}/>,
    },
    {
        path: '#',
        title: '更多',
        icon: <FiInfo size={16}/>,
        isDropdown: true,
        children: [
            {
                path: '/code',
                title: '开发字体',
                icon: <FiCode size={16}/>,
            },
            {
                path: '/about',
                title: '关于我',
                icon: <FiInfo size={16}/>,
            },
            {
                path: '/contact',
                title: '联系方式',
                icon: <FiMail size={16}/>,
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
        icon: <FiLogIn size={16}/>,
    },
    {
        path: '#register',
        title: '注册',
        icon: <FiUserPlus size={16}/>,
    },
];

// 滚动动画配置 - 增加滚动范围，让转场更从容
const SCROLL_CONFIG = {
    start: 0,
    end: 150,
} as const;
/**
 * 提取标签文本和键
 */
const extractTagInfo = (tag: string | any, index: number) => {
    const tagText = typeof tag === 'string' ? tag : tag?.name || '';
    const tagKey = typeof tag === 'string' ? tag : tag?.id || index;
    return {tagText, tagKey};
};

const Header: React.FC<HeaderProps> = ({scrolled = false, pageInfo}) => {

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const {user, isLoggedIn} = useSelector((state: any) => state.user);

    // Router
    const location = useLocation();

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
    const isRouteChangingRef = useRef(false);
    // ======================framer-motion动画配置=================

    // 动画引擎
    const {springPresets} = useAnimationEngine();

    // 滚动动画
    const {scrollY} = useScroll();


    // 创建手动控制的 motion value 将「用户滚动页面的原始像素位置」转换为「0~1 之间的平滑进度信号」
    const smoothProgress = useMotionValue(0)

    // 监听滚动变化,更新smoothProgress
    useEffect(() => {
        const updateProgress = (latest: number) => {
            // 路由切换期间不更新动画进度
            if (isRouteChangingRef.current) return
            // 计算滚动进度
            const progress = Math.max(0, Math.min(1, (latest - SCROLL_CONFIG.start) / (SCROLL_CONFIG.end - SCROLL_CONFIG.start)))

            // 使用Spring 动画更新进度
            animate(smoothProgress, progress, {
                ...springPresets.microRebound,
                restDelta: 0.01,
                restSpeed: 0.01,
            })
        };
        const unsubscribe = scrollY.on('change', updateProgress);
        // 初始化
        updateProgress(scrollY.get());
        return unsubscribe;
    }, [scrollY, springPresets.microRebound, smoothProgress]);

    // 导航栏动画属性 - 添加更丰富的动画效果
    const borderRadius = useTransform(smoothProgress, [0, 1], [28, 24]);
    const paddingXValue = useTransform(smoothProgress, [0, 1], [20, 16]);

    // 页面信息显示状态 - 与导航栏收缩同步
    const [pageInfoShouldShow, setPageInfoShouldShow] = useState(false);

    // 添加微妙的 scale 变化，增强 Q弹 效果
    const scale = useTransform(smoothProgress, [0, 1], [1, 0.98]);

    // ==================== 页面信息动画系统 ====================
    // 统一的 Spring 配置 - 确保所有动画协调一致，符合物理运动规律
    // restDelta 和 restSpeed 设置为极小值，确保动画完全停止后才结束，避免抖动
    const unifiedSpringConfig = useMemo(
        () => ({
            ...springPresets.microRebound,
            restDelta: 0.001,
            restSpeed: 0.01,
        }),
        [springPresets.microRebound],
    );

    // 动画编排：使用三段式关键帧实现流畅的物理运动
    // 1️⃣ 导航链接先向左移动 (0 → 0.6 → 1) - 为页面信息让出空间
    const navLinksXRaw = useTransform(smoothProgress, [0, 0.6, 1], [0, -15, -18]);
    const navLinksX = useSpring(navLinksXRaw, unifiedSpringConfig);

    // 2️⃣ 页面信息宽度展开 (0 → 0.3 → 1) - 稍后展开，创造层次感
    const pageInfoWidthRaw = useTransform(smoothProgress, [0, 0.3, 1], [0, 200, 380]);
    const pageInfoWidth = useSpring(pageInfoWidthRaw, unifiedSpringConfig);

    // 3️⃣ 页面信息透明度渐显 (0 → 0.4 → 1) - 配合宽度展开
    const pageInfoOpacityRaw = useTransform(smoothProgress, [0, 0.4, 1], [0, 0.5, 1]);
    const pageInfoOpacity = useSpring(pageInfoOpacityRaw, unifiedSpringConfig);

    // 4️⃣ 页面信息纵向滑入 (0 → 0.5 → 1) - 最后从上到下出现，打造诗意效果
    const pageInfoYRaw = useTransform(smoothProgress, [0, 0.5, 1], [-12, -6, 0]);
    const pageInfoY = useSpring(pageInfoYRaw, unifiedSpringConfig);

    // 监听 smoothProgress 变化，同步显示/隐藏状态
    useMotionValueEvent(smoothProgress, 'change', (latest) => {
        // 路由切换时不更新状态，避免闪烁
        if (!isRouteChangingRef.current) {
            setPageInfoShouldShow(latest > 0.2);
        }
    });

    // =======================回调函数=============================

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
                        icon: <FiUser size={16}/>,
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

    // 使用useLayoutEffect 在浏览器Dom更新后但绘制之前执行，避免操作dom导致页面先看到旧的在看到新的页面
    useLayoutEffect(() => {
        // const currentPath = location.pathname;
        // 标记路由正在切换（在所有状态更新之前设置）
        isRouteChangingRef.current = true;
        // 立即重置所有状态，确保在浏览器绘制前完成
        setInternalScrolled(false);
        // 所有基于smoothProgress 的动画立即回到初始状态
        smoothProgress.set(0);

        // 延迟恢复，确保新页面完全渲染后才允许页面信息显示
        const timeoutId = setTimeout(() => {
            isRouteChangingRef.current = false;
        }, 200)
        return () => clearTimeout(timeoutId);
    }, [location.pathname, smoothProgress]);
    return (
        <div className={`header ${internalScrolled ? 'scrolled' : ''}`}>
            <HeaderContainer scrolled={internalScrolled}>
                {/* Logo */}
                <AnimatedLogo>
                </AnimatedLogo>
                {/* 桌面导航栏 */}
                <DeskTopNavWrapper>
                    <motion.div className="nav-card" ref={navCardRef} layout="position" transition={{
                        layout: unifiedSpringConfig,
                    }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius,
                                    paddingLeft: paddingXValue,
                                    paddingRight: paddingXValue,
                                    scale
                                }}>
                        <div className="nav-card-inner"
                             style={{display: 'flex', alignItems: 'center', width: '100%', minHeight: '0'}}>
                            {/* 导航链接 - 向左移动为页面信息让出空间 */}
                            <motion.div style={{x: navLinksX, display: 'flex', alignItems: 'center'}}>
                                <NavLinks
                                    mainNavItems={mainNavItems}
                                    onLinkClick={handleLinkClick}
                                    moreDropdownOpen={moreDropdownOpen}
                                    toggleMoreDropdown={toggleMoreDropdown}
                                    dropdownRef={dropdownRef as RefObject<HTMLDivElement>}
                                />

                            </motion.div>

                            {pageInfo && (pageInfo.title || pageInfo.tags) && pageInfoShouldShow && (
                                <PageInfoContainer
                                    layout={false}
                                    style={{
                                        opacity: pageInfoOpacity,
                                        y: pageInfoY,
                                        width: pageInfoWidth,
                                    }}
                                >
                                    <div style={{display: 'flex', flexDirection: 'column', minWidth: 0}}>
                                        {pageInfo.title && <PageTitle>{pageInfo.title}</PageTitle>}
                                        {pageInfo.subtitle && <PageSubtitle>{pageInfo.subtitle}</PageSubtitle>}
                                    </div>

                                    {pageInfo.tags && pageInfo.tags.length > 0 && (
                                        <TagsContainer>
                                            {pageInfo.tags.slice(0, 2).map((tag, index) => {
                                                const {tagText, tagKey} = extractTagInfo(tag, index);
                                                return (
                                                    <Tag key={tagKey}>
                                                        <FiTag/>
                                                        {tagText}
                                                    </Tag>
                                                );
                                            })}
                                            {pageInfo.tags.length > 2 && <Tag>+{pageInfo.tags.length - 2}</Tag>}
                                        </TagsContainer>
                                    )}
                                </PageInfoContainer>
                            )}

                        </div>

                        {/* 主题切换和用户菜单 */}
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <ThemeToggle/>
                            <UserMenu
                                userDropdownOpen={userDropdownOpen}
                                toggleUserDropdown={toggleUserDropdown}
                                userDropdownRef={userDropdownRef as React.RefObject<HTMLDivElement>}
                                handleLogin={handleLogin}
                                handleRegister={handleRegister}
                                handleLinkClick={handleLinkClick}
                            />
                        </div>

                    </motion.div>

                </DeskTopNavWrapper>
                {/** 移动端的主题切换按钮和用户头像点击登录 */}
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <MobileAvatar onClick={(e) => toggleUserDropdown(e)} hasImage={!!user?.avatar}>
                        {isLoggedIn && user?.avatar ? (
                            <img src={user.avatar} alt={user.username}/>
                        ) : (
                            <FiUser color='var(--text-secondary)'/>
                        )}
                    </MobileAvatar>
                    <MenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <FiX/> : <FiMenu/>}
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