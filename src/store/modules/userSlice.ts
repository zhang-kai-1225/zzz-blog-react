import { storage } from "@/utils";
import { API } from "@/utils/api";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export interface User {
    id: string | number;
    username: string;
    email?: string;
    avatar?: string;
    role?: string;
    status?: string;
}
interface UserState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
}
const getUserFromStorage = () => {
    const userData = storage.local.get('user')
    const tokenData = storage.local.get('token')
    if (userData && tokenData) {
        return {
            user: userData as any,
            token: tokenData as string,
            isLoggedIn: true,
            loading: false,
            error: null,
        }
    }
    return {
        user: null,
        token: null,
        isLoggedIn: false,
        loading: false,
        error: null,
    }
}
// 模拟注册API调用
const registerAPI = (data: { username: string, email: string, password: string }): Promise<any> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                code: 200,
                message: '注册成功',
                data: {
                    user: {
                        id: Math.floor(Math.random() * 1000),
                        username: data.username,
                        email: data.email,
                        role: 'user',
                        status: 'active',
                    },
                    token: 'dummy-token-' + Math.random()
                }
            })
        }, 1000)
    })
}
const initialState: UserState = getUserFromStorage();
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: User, token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            state.error = null;
        }
    }
})
// 处理用户登录逻辑
export const login = (username: string, password: string) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await API.user.login({ username, password });
        if (response.code === 200) {
            dispatch(setUser({ user: response.data.user, token: response.data.token }))
            storage.local.set('user', response.data.user);
            storage.local.set('token', response.data.token);
            adnaan.toast.success('登录成功', '欢迎回来');
        } else {
            dispatch(setError(response.message || '登录失败'));
        }
    } catch (error) {
        const errorMessage = '登录失败，请稍后重试'
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }

}
// 处理用户注册逻辑,异步action
export const register = (username: string, email: string, password: string) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        // 使用临时的注册API方法，实际项目中应该替换为真实API调用
        const response = await registerAPI({ username, email, password });
        if (response.code === 200) {
            dispatch(setUser({ user: response.data.user, token: response.data.token }));
            // 注册成功后，将用户信息和token存储到localStorage
            storage.local.set('user', response.data.user);
            storage.local.set('token', response.data.token);
            // 注册成功后，显示成功提示
            // adnaan.toast.success('注册成功，正在为您登录', '恭喜');
            await dispatch(login(username, password));
        }
    } catch (error) {
        const errorMessage = '注册失败，请稍后重试'
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
}

// 处理用户退出登录
export const logoutUser = () => async (dispatch: any) => {
    try {
        await API.user.logout();
        // 退出登录后，清除localStorage中的用户信息和token
        storage.local.remove('user');
        storage.local.remove('token');
        storage.local.remove('profile_active_tab');
        storage.local.remove('profile_open_tab');
        dispatch(logout());
        window.location.href = '/'
    } catch (error) {
        console.error('logout failed:', error);
        // 即使退出登录失败，也应该清除localStorage中的用户信息和token
        storage.local.remove('user');
        storage.local.remove('token');
        storage.local.remove('profile_active_tab');
        storage.local.remove('profile_open_tab');
        dispatch(logout());
        window.location.href = '/'
    }
}
export const { setUser, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer;
