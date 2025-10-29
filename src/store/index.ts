import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from 'react-redux';
import themeReducer from './modules/themeSlice';
import userReducer from './modules/userSlice';

// 配置store: 配置store的初始状态和reducer函数
const store = configureStore({
    // 配置reducer键值对,给状态 “分区” 并指定每个分区的管理规则
    reducer: {
        // 配置theme状态的管理规则,使用themeReducer处理theme相关的action
        theme: themeReducer,
        // 配置user状态的管理规则,使用userReducer处理user相关的action
        user: userReducer,
    }
    // 配置middleware
});
// 从 store 中推断出 RootState 类型
export type RootState = ReturnType<typeof store.getState>;
// 从 store 中推断出 AppDispatch 类型
export type AppDispatch = typeof store.dispatch;

// 创建类型安全的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;