import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { storage } from "@/utils";
import { executeThemeTransition } from "@/utils/theme-transition";
// 定义主题类型
type Theme = 'light' | 'dark';
type ThemeMode = 'auto' | 'light' | 'dark';
interface ThemeState {
    mode: ThemeMode; // 用户选择的模式
    theme: Theme; // 实际应用的主题
}
// 定义主题切换动画配置项
interface TransitionOptions {
    x?: number;
    y?: number;
    duration?: number;
}
// 同步主题到页面Dom
const applyTheme = (theme: Theme) => {
    // 检查当前环境是否有document对象，document是浏览器环境特有的，服务端环境没有document对象
    if (typeof document === 'undefined') return;
    // 1. 设置data-theme属性（相当于给<html>元素添加一个自定义属性）后续通过css选择器[data-theme]来切换主题
    document.documentElement.setAttribute('data-theme', theme);
};
// 获取系统主题偏好
const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return systemTheme;
}
// 获取已保存的主题
const getSavedTheme = (): ThemeMode => {
    if (typeof window === 'undefined') return 'light';
    const savedMode = storage.local.get('themeMode') as ThemeMode;
    return savedMode === 'dark' || savedMode === 'light' || savedMode === 'auto' ? savedMode : 'auto';
}
// 定义初始状态
const initialState: ThemeState = {
    mode: 'auto', // 默认自动模式
    theme: 'light',
};
// 创建slice，封装主题的修改逻辑
const themeSlice = createSlice({
    name: 'theme', // 切片名称，用于在全局状态中标识该切片的状态
    initialState,
    reducers: {
        // 1. 设置主题（支持外部传入）
        _setModeInternal: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
            // 2. 同步更新到 localStorage,防止刷新后丢失主题
            storage.local.set('themeMode', action.payload);
            // 3. 根据模式更新主题
            if (action.payload === 'auto') {
                state.theme = getSystemTheme();
            } else {
                state.theme = action.payload;
            }
            applyTheme(state.theme);
        },
        // 2. 循环切换主题 light → dark → auto → light（内部使用，不包含动画）
        _cycleThemeInternal: (state) => {
            const cycle: ThemeMode[] = ['light', 'dark', 'auto'];
            const currentIndex = cycle.indexOf(state.mode);
            const nextMode = cycle[(currentIndex + 1) % cycle.length];

            state.mode = nextMode;
            storage.local.set('themeMode', nextMode);

            if (nextMode === 'auto') {
                state.theme = getSystemTheme();
            } else {
                state.theme = nextMode;
            }
            applyTheme(state.theme);
        },
        // 内部使用：仅更新实际主题（用于 auto 模式下系统主题变化）
        updateTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            applyTheme(action.payload);
        },
    }
});

/**
 * 带动画的循环设置主题模式
 */
export const cycleTheme = (options: TransitionOptions = {}) => {
    return async (dispatch: any) => {
        await executeThemeTransition(() => dispatch(_cycleThemeInternal()), options);
    }
}
export const initializeTheme = () => (dispatch: any) => {
    try {
        // 1. 获取已保存的主题模式 
        const savedMode = getSavedTheme();
        if (savedMode) {
            dispatch(_setModeInternal(savedMode));
            return;
        }
        // 2. 如果没有保存的主题模式就使用系统主题模式
        dispatch(_setModeInternal('auto'));
        return 'auto'
    } catch (error) {
        console.error('Error initializing theme:', error);
        dispatch(_setModeInternal('auto'));
        return 'auto';
    }
}
// 导出actions，用于在组件中触发状态修改
export const { _setModeInternal, _cycleThemeInternal, updateTheme } = themeSlice.actions;
// 导出reducer，用于在store中注册该切片的状态管理规则
export default themeSlice.reducer;