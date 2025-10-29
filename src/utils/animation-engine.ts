import type { Variants } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface PerformanceMetrics {
    fps: number;
    memory: number;
    cores: number;
    hasWebGL: boolean;
    devicePixelRatio: number;
    prefersReducedMotion: boolean;
    connectionType: string;
    level: 'ultra' | 'high' | 'medium' | 'low' | 'minimal'
}
export interface AnimationConfig {
    duration: number;
    ease: readonly number[] | string | { type: string;[key: string]: any };
    delay?: number;
    stagger?: number;
}
// 性能监控器类: 单例模式（全局唯一实例， 避免重复监控浪费资源）
class PerformanceMonitor {
    // 1. 静态属性：存储全局唯一实例（单例核心）
    private static instance: PerformanceMonitor;
    // 2. 实例属性：存储性能指标数据（初始为null，后续初始化）
    private metrics: PerformanceMetrics | null = null;
    // 3. 实例属性：存储最近100帧的FPS历史（用于计算平均FPS）
    private fpsHistory: number[] = [];
    // 4. 实例属性：记录上一帧的时间（用于计算帧间隔）
    private lastFrameTime = performance.now();
    // 5. 实例属性：帧计数器（每60帧更新一次性能等级，约1秒）
    private frameCount = 0;
    // 6. 实例属性：requestAnimationFrame的ID（用于后续取消监控，避免内存泄漏）
    private rafId: number | null = null;
    // 私有构造函数：禁止外部直接new（单例模式核心，确保只能通过getInstance创建）
    private constructor() {
        this.startMonitoring(); // 构造函数执行时，立即开始性能监控
    }
    // 静态方法：对外提供全局唯一实例（单例入口）
    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) { // 如果实例不存在，创建新实例
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance; // 存在则直接返回
    }

    // 私有方法：开始监控FPS（核心逻辑）
    private startMonitoring() {
        // 定义「每帧执行的函数」：计算当前FPS并更新历史
        const measureFPS = () => {
            const now = performance.now(); // 获取当前时间（毫秒，高精度）
            const delta = now - this.lastFrameTime; // 计算上一帧到当前帧的时间差（帧间隔）

            // 如果帧间隔>0（避免除以0），计算当前FPS并加入历史
            if (delta > 0) {
                const fps = 1000 / delta; // FPS = 1000毫秒 / 帧间隔（如16.67ms间隔=60FPS）
                this.fpsHistory.push(fps);

                // 只保留最近100帧的FPS（避免数据堆积，节省内存）
                if (this.fpsHistory.length > 100) {
                    this.fpsHistory.shift(); // 删除最旧的一帧数据
                }
            }

            // 更新上一帧时间和帧计数器
            this.lastFrameTime = now;
            this.frameCount++;

            // 每60帧（约1秒）更新一次性能等级（避免频繁计算）
            if (this.frameCount % 60 === 0) {
                this.updatePerformanceLevel();
            }

            // 继续监控下一帧（浏览器动画专用API，确保与屏幕刷新同步）
            this.rafId = requestAnimationFrame(measureFPS);
        };

        // 启动第一帧监控
        this.rafId = requestAnimationFrame(measureFPS);
    }

    // 私有方法：根据平均FPS更新性能等级
    private updatePerformanceLevel() {
        if (!this.metrics) return; // 如果性能指标未初始化，直接返回

        const avgFPS = this.getAverageFPS(); // 获取最近100帧的平均FPS
        const oldLevel = this.metrics.level; // 记录旧的性能等级

        // 根据平均FPS动态调整性能等级（原代码逻辑）
        if (avgFPS >= 55) {
            this.metrics.level = 'ultra'; // 顶级：≥55FPS（如高端手机/电脑）
        } else if (avgFPS >= 45) {
            this.metrics.level = 'high'; // 高端：45-54FPS
        } else if (avgFPS >= 30) {
            this.metrics.level = 'medium'; // 中端：30-44FPS
        } else if (avgFPS >= 20) {
            this.metrics.level = 'low'; // 低端：20-29FPS
        } else {
            this.metrics.level = 'minimal'; // 最差：<20FPS（如老旧设备）
        }

        // 如果性能等级变化，打印日志（便于开发调试）
        if (oldLevel !== this.metrics.level) {
            console.log(`[Animation Engine] Performance level changed: ${oldLevel} → ${this.metrics.level}`);
        }
    }

    // 公有方法：计算最近100帧的平均FPS
    getAverageFPS(): number {
        if (this.fpsHistory.length === 0) return 60; // 初始无数据时，默认60FPS
        // 求和后除以帧数，得到平均值
        return this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    }

    // 公有方法：获取完整性能指标（首次调用时初始化）
    getMetrics(): PerformanceMetrics {
        if (this.metrics) return this.metrics; // 已初始化则直接返回

        // 1. 初始化：检测用户是否开启「减少动画」模式（无障碍设置，原代码逻辑）
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // 2. 初始化：检测设备是否支持WebGL（优化版，避免内存泄漏）
        let hasWebGL = false;
        try {
            const canvas = document.createElement('canvas'); // 创建临时canvas元素
            // 尝试获取WebGL2或WebGL上下文（failIfMajorPerformanceCaveat：排除性能差的设备）
            const gl =
                canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
                canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
            hasWebGL = !!gl; // 有上下文则支持WebGL

            // 立即释放WebGL上下文（避免内存泄漏，原代码优化点）
            if (gl) {
                const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
                if (ext) ext.loseContext(); // 主动释放上下文
            }
            canvas.width = canvas.height = 0; // 清空canvas尺寸，释放资源
        } catch (e) {
            hasWebGL = false; // 捕获异常，标记为不支持
        }

        // 3. 初始化：获取CPU核心数、内存（部分浏览器不支持，用默认值）
        const cores = navigator.hardwareConcurrency || 4; // 默认为4核
        const memory = (navigator as any).deviceMemory || 4; // 默认为4GB（原代码类型断言）
        const devicePixelRatio = window.devicePixelRatio || 1; // 默认为1（普通屏）

        // 4. 初始化：检测网络连接类型（兼容性处理，原代码逻辑）
        const connection =
            (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        const connectionType = connection?.effectiveType || '4g'; // 默认为4g

        // 5. 初始化：计算初始性能等级（结合硬件+系统设置）
        let level: PerformanceMetrics['level'] = 'medium'; // 默认中端
        if (prefersReducedMotion) {
            level = 'minimal'; // 开启减少动画，直接最低级
        } else if (hasWebGL && cores >= 8 && memory >= 8 && devicePixelRatio <= 2) {
            level = 'ultra'; // 顶级：支持WebGL+8核+8GB内存+非超高清屏
        } else if (hasWebGL && cores >= 4 && memory >= 4) {
            level = 'high'; // 高端：支持WebGL+4核+4GB内存
        } else if (cores >= 2 && memory >= 2) {
            level = 'medium'; // 中端：2核+2GB内存
        } else {
            level = 'low'; // 低端：低于上述配置
        }

        // 6. 赋值性能指标并返回（与接口字段完全匹配）
        this.metrics = {
            fps: 60, // 初始默认60FPS
            memory,
            cores,
            hasWebGL,
            devicePixelRatio,
            prefersReducedMotion,
            connectionType,
            level,
        };

        return this.metrics;
    }

    // 公有方法：销毁监控（组件卸载时调用，避免内存泄漏）
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId); // 取消requestAnimationFrame
            this.rafId = null; // 置空ID，便于垃圾回收
        }
    }
}
// 动画调度器
class AnimationScheduler {
    private static instance: AnimationScheduler;
    private queue: Array<{ priority: number; callback: () => void }> = [];
    private isProcessing = false;
    private maxConcurrent = 5;

    private constructor() { }

    static getInstance(): AnimationScheduler {
        if (!AnimationScheduler.instance) {
            AnimationScheduler.instance = new AnimationScheduler();
        }
        return AnimationScheduler.instance;
    }

    schedule(callback: () => void, priority: 'critical' | 'high' | 'normal' | 'low' = 'normal') {
        const priorityMap = { critical: 4, high: 3, normal: 2, low: 1 };
        this.queue.push({ priority: priorityMap[priority], callback });
        this.queue.sort((a, b) => b.priority - a.priority);
        this.process();
    }

    private async process() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const batch = this.queue.splice(0, this.maxConcurrent);

            await Promise.all(
                batch.map(
                    (item) =>
                        new Promise((resolve) => {
                            requestAnimationFrame(() => {
                                item.callback();
                                resolve(undefined);
                            });
                        }),
                ),
            );
        }

        this.isProcessing = false;
    }

    updateConcurrency(level: PerformanceMetrics['level']) {
        const concurrencyMap = {
            ultra: 10,
            high: 7,
            medium: 5,
            low: 3,
            minimal: 1,
        };
        this.maxConcurrent = concurrencyMap[level];
    }
}

// ==================== 缓动函数库 ====================

export const EASING = {
    // 标准缓动
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],

    // 自定义缓动
    smooth: [0.25, 0.46, 0.45, 0.94],
    snappy: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],

    // 物理缓动
    spring: { type: 'spring' as const, stiffness: 300, damping: 20 },
    softSpring: { type: 'spring' as const, stiffness: 150, damping: 15 },
    stiffSpring: { type: 'spring' as const, stiffness: 500, damping: 30 },
} as const;

// ==================== 动画变体库 ====================

export class AnimationVariants {
    private static configs: Record<PerformanceMetrics['level'], AnimationConfig> = {
        ultra: { duration: 0.6, ease: EASING.smooth, stagger: 0.08 },
        high: { duration: 0.4, ease: EASING.smooth, stagger: 0.05 },
        medium: { duration: 0.3, ease: EASING.snappy, stagger: 0.03 },
        low: { duration: 0.2, ease: EASING.snappy, stagger: 0.02 },
        minimal: { duration: 0.1, ease: EASING.linear, stagger: 0 },
    };

    static getConfig(level: PerformanceMetrics['level']): AnimationConfig {
        return this.configs[level];
    }

    // 淡入动画
    static fadeIn(level: PerformanceMetrics['level']): Variants {
        const config = this.getConfig(level);
        if (level === 'minimal') {
            return {
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: config.duration } },
            };
        }
        return {
            hidden: { opacity: 0, y: 20 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: config.duration, ease: config.ease as any },
            },
        };
    }

    // 滑入动画
    static slideIn(direction: 'left' | 'right' | 'top' | 'bottom', level: PerformanceMetrics['level']): Variants {
        const config = this.getConfig(level);
        const distance = level === 'minimal' ? 0 : 50;

        const offsets = {
            left: { x: -distance, y: 0 },
            right: { x: distance, y: 0 },
            top: { x: 0, y: -distance },
            bottom: { x: 0, y: distance },
        };

        return {
            hidden: { opacity: 0, ...offsets[direction] },
            visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: { duration: config.duration, ease: config.ease as any },
            },
        };
    }

    // 缩放动画
    static scale(level: PerformanceMetrics['level']): Variants {
        const config = this.getConfig(level);
        const scaleValue = level === 'minimal' ? 1 : 0.9;

        return {
            hidden: { opacity: 0, scale: scaleValue },
            visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: config.duration, ease: config.ease as any },
            },
        };
    }

    // 交错容器
    static stagger(level: PerformanceMetrics['level']): Variants {
        const config = this.getConfig(level);

        return {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: config.stagger,
                    delayChildren: level === 'minimal' ? 0 : 0.1,
                },
            },
        };
    }

    // 列表项动画
    static listItem(level: PerformanceMetrics['level']): Variants {
        const config = this.getConfig(level);

        if (level === 'minimal') {
            return {
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: config.duration } },
            };
        }

        return {
            hidden: { opacity: 0, x: -20 },
            visible: {
                opacity: 1,
                x: 0,
                transition: { duration: config.duration, ease: config.ease as any },
            },
        };
    }

    // 卡片动画
    static card(level: PerformanceMetrics['level']): Variants {
        const config = this.getConfig(level);

        if (level === 'minimal') {
            return {
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: config.duration } },
            };
        }

        return {
            hidden: { opacity: 0, y: 15, scale: 0.95 },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: config.duration, ease: config.ease as any },
            },
        };
    }

    // 模态框动画
    static modal(level: PerformanceMetrics['level']): Variants {
        const config = this.getConfig(level);

        return {
            hidden: { opacity: 0, scale: 0.95, y: 20 },
            visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: config.duration, ease: config.ease as any },
            },
            exit: {
                opacity: 0,
                scale: 0.95,
                y: 20,
                transition: { duration: config.duration * 0.7 },
            },
        };
    }
}
// 主 Hook
export const useAnimationEngine = () => {
    const monitor = useMemo(() => PerformanceMonitor.getInstance(), []);
    const schedule = useMemo(() => AnimationScheduler.getInstance(), []);
    const [metrics, setMetrics] = useState<PerformanceMetrics>(() => monitor.getMetrics());

    useEffect(() => {
        // 每2s更新一下指标
        const interval = setInterval(() => {
            const newMetrics = monitor.getMetrics();
            setMetrics(newMetrics);
            schedule.updateConcurrency(newMetrics.level);
        }, 2000);
        return () => clearInterval(interval);
    }, [monitor, schedule]);

    // 获取动画变体
    const variants = useMemo(
        () => ({
            fadeIn: AnimationVariants.fadeIn(metrics.level),
            slideInLeft: AnimationVariants.slideIn('left', metrics.level),
            slideInRight: AnimationVariants.slideIn('right', metrics.level),
            slideInTop: AnimationVariants.slideIn('top', metrics.level),
            slideInBottom: AnimationVariants.slideIn('bottom', metrics.level),
            scale: AnimationVariants.scale(metrics.level),
            stagger: AnimationVariants.stagger(metrics.level),
            listItem: AnimationVariants.listItem(metrics.level),
            card: AnimationVariants.card(metrics.level),
            modal: AnimationVariants.modal(metrics.level),
        }),
        [metrics.level],
    );
    // 调度动画
    const scheduleAnimation = useCallback(
        (callback: () => void, priority: 'critical' | 'high' | 'normal' | 'low' = 'normal') => {
            schedule.schedule(callback, priority);
        },
        [schedule],
    );
    // 获取配置
    const config = useMemo(() => AnimationVariants.getConfig(metrics.level), [metrics.level]);
    // 悬停动画
    const hoverProps = useMemo(() => {
        if (metrics.level === 'minimal' || metrics.prefersReducedMotion) {
            return {};
        }
        return {
            whileHover: { scale: 1.02, y: -2 },
            whileTap: { scale: 0.98 },
            transition: { duration: 0.2 }
        }
    }, [metrics.level, metrics.prefersReducedMotion]);
    return {
        // 性能指标
        metrics,
        fps: monitor.getAverageFPS(),
        level: metrics.level,
        shouldReduceMotion: metrics.prefersReducedMotion,

        // 动画变体
        variants,

        // 动画配置
        config,
        easing: EASING,

        // 工具方法
        scheduleAnimation,
        hoverProps,
    };

}

// ==================== 导出 ====================

export default {
    useAnimationEngine,
    AnimationVariants,
    EASING,
    PerformanceMonitor,
    AnimationScheduler,
};