import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { storage } from "@/utils";
// 定义主题类型
type Theme = 'light' | 'dark';
interface ThemeState {
    theme: Theme;
}
// 同步主题到页面Dom
const applyTheme = (theme: Theme) => {
    // 检查当前环境是否有document对象，document是浏览器环境特有的，服务端环境没有document对象
    if (typeof document === 'undefined') return;
    // 1. 设置data-theme属性（相当于给<html>元素添加一个自定义属性）后续通过css选择器[data-theme]来切换主题
    document.documentElement.setAttribute('data-theme', theme);
    // 2. 同步更新到 localStorage,防止刷新后丢失主题
    storage.local.set('theme', theme);
};

// 定义初始状态
const initialState: ThemeState = {
    theme: 'light',
};
// 创建slice，封装主题的修改逻辑
const themeSlice = createSlice({
    name: 'theme', // 切片名称，用于在全局状态中标识该切片的状态
    initialState,
    reducers: {
        // 1. 设置主题（支持外部传入）
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            // 2. 同步更新到 localStorage,防止刷新后丢失主题
            applyTheme(action.payload);
        },
        // 2. 切换主题
        toggleTheme: (state) => {
            // 1. 切换主题
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            // 2. 同步更新到 localStorage,防止刷新后丢失主题
            applyTheme(state.theme);
        }
    }
});
// 导出actions，用于在组件中触发状态修改
export const { setTheme, toggleTheme } = themeSlice.actions;
// 导出reducer，用于在store中注册该切片的状态管理规则
export default themeSlice.reducer;