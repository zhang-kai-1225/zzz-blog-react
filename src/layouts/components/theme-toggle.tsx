
import styled from "@emotion/styled";
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { cycleTheme } from '@/store/modules/themeSlice';
import type { RootState } from '@/store';
import { FiMoon, FiSun, FiMonitor } from "react-icons/fi";
import { useRef, useState } from "react";
import { getElementCenter } from "@/utils/theme-transition";
// 主题切换容器
const ThemeToggleContainer = styled(motion.div)`
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;

`
// 主题切换按钮
const ThemeToggleButton = styled(motion.button)`
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    position: relative;
    z-index: 2;
    /* 增强悬停效果 */
    &:hover {
        transform: rotate(15deg);
    }
    &:active {
        transform:scale(0.9) rotate(15deg);
    }
    /* 禁用状态下的样式（防止动画期间重复点击） */
    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`
// 图标容器 用于包裹图标和相应的样式
const IconContainer = styled(motion.div)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  svg {
    color: var(--text-secondary);
    min-width: 20px;
    &:hover {
      // background-color: var(--accent-color-alpha);
      color: var(--accent-color);
    }
  }
`;
// 太阳光线动画
const SunRays = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at center, var(--accent-color-alpha) 0%, transparent 70%);
  opacity: 0;
`;

const ThemeToggle: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme.theme);
    const mode = useSelector((state: RootState) => state.theme.mode);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const getAriaLabel = () => {
        switch (mode) {
            case 'light':
                return '当前：浅色模式，点击切换到深色模式';
            case 'dark':
                return '当前：深色模式，点击切换到自动模式';
            case 'auto':
                return `当前：自动模式（${theme === 'dark' ? '深色' : '浅色'}），点击切换到浅色模式`;
            default:
                return '切换主题';
        }
    }
    // 处理主题切换
    const handleToggle = async () => {
        // 防止动画期间重复点击
        if (isTransitioning) return;
        setIsTransitioning(true);
        // 获取按钮中心元素作为动画起点
        const center = buttonRef.current ? getElementCenter(buttonRef.current) : undefined;
        try {
            // 使用动画切换主题
            await dispatch(cycleTheme({
                x: center?.x,
                y: center?.y,
                duration: 800,
            }) as any);
        } finally {
            setTimeout(() => setIsTransitioning(false), 100);
        }
    }
    // 太阳动画变体
    const sunVariants: Variants = {
        initial: {
            rotate: 0,
            scale: 0.8,
            opacity: 0,
        },
        animate: {
            rotate: 360,
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
        exit: {
            rotate: -360,
            scale: 0.8,
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
    };

    // 月亮动画变体
    const moonVariants: Variants = {
        initial: {
            rotate: 0,
            scale: 0.8,
            opacity: 0,
        },
        animate: {
            rotate: -360,
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
        exit: {
            rotate: 360,
            scale: 0.8,
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
    };

    // 光线动画变体
    const raysVariants: Variants = {
        initial: {
            scale: 0.8,
            opacity: 0,
        },
        animate: {
            scale: 1.2,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
    };
    // 自动模式动画变体
    const autoVariants = {
        initial: {
            scale: 0.8,
            opacity: 0,
            rotate: -90,
        },
        animate: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
                duration: 0.5,
                ease: 'easeInOut' as any,
            },
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            rotate: 90,
            transition: {
                duration: 0.5,
                ease: 'easeInOut' as any,
            },
        },
    };
    return (
        <ThemeToggleContainer>
            <ThemeToggleButton onClick={handleToggle} ref={buttonRef} disabled={isTransitioning} aria-label={getAriaLabel()} title={getAriaLabel()} whileHover={{ scale: isTransitioning ? 1 : 1.1 }}
                whileTap={{ scale: isTransitioning ? 1 : 0.9 }} > 
                <AnimatePresence mode="wait">
                    {mode === 'light' ? (
                        <IconContainer key="sun" variants={sunVariants} initial="initial" animate="animate" exit="exit">
                            <FiSun size={20} />
                            <SunRays variants={raysVariants} initial="initial" animate="animate" exit="exit" />
                        </IconContainer>
                    ) : mode === 'dark' ? (
                        <IconContainer key="moon" variants={moonVariants} initial="initial" animate="animate" exit="exit">
                            <FiMoon size={20} />
                        </IconContainer>
                        ) : (
                            <IconContainer key="auto" variants={autoVariants} initial="initial" animate="animate" exit="exit">
                                <FiMonitor size={20} />
                            </IconContainer>
                    )}
                </AnimatePresence>
            </ThemeToggleButton>
        </ThemeToggleContainer>
    )
}
export default ThemeToggle;