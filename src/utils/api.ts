import { data } from 'react-router-dom';
import http from './http';
export interface LoginParams {
    username: string;
    password: string;
    remember?: boolean;
}
export interface UserInfo {
    id: string | number;
    username: string;
    nickname?: string;
    avatar?: string;
    email?: string;
    role?: string;
    [key: string]: any;
}
export interface LoginResponse {
    token: string;
    user: UserInfo;
}
// 注册参数
export interface RegisterParams {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}
/**
 * 个人中心相关接口类型定义
 */
export interface UserProfile {
    id: string | number;
    username: string;
    fullName?: string; // 对应数据库的 full_name 字段
    email: string;
    avatar?: string;
    bio?: string;
    role?: string;
    status?: string;
    joinDate: string;
    lastLoginTime?: string;
    stats?: {
        articleCount: number;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        followerCount: number;
        followingCount: number;
        bookmarkCount: number;
    };
}
/**
 * 更新个人信息参数类型定义
 */
export interface UpdateProfileParams {
    fullName?: string; // 对应数据库的 full_name 字段
    email?: string;
    bio?: string;
}
/**
 * 更改密码参数类型定义
 */
export interface ChangePasswordParams {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export const API = {
    // 用户相关Api
    user: {
        // 登录
        login: (data: LoginParams) => http.post<LoginResponse>('/auth/login', data),
        // 注册
        register: (data: RegisterParams) => http.post<LoginResponse>('/auth/register', data),
        // 退出登录
        logout: () => http.post('/auth/logout'),

        // 用户中心相关
        getProfile: () => http.get<UserProfile>('/users/profile'),
        // 更新个人信息
        updateProfile: (data: UpdateProfileParams) => http.put<UserProfile>('/users/profile', data),
        // 更改密码
        changePassword: (data: ChangePasswordParams) => http.put('/users/password', data),
        // 上传头像
        uploadAvatar: (file: File) => {
            const formData = new FormData();
            formData.append('avatar', file);
            return http.upload('/users/avatar', formData)
        }
    }
}
export default API;