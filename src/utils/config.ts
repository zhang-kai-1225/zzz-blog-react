/**
 * 全局配置文件
 */
interface Config {
    // 环境标识
    env: 'development' | 'production';
    // API 基础URL
    apiBaseUrl: string;
    // 接口超时时间（毫秒）
    timeout: number;
    // 是否为开发环境
    isDev: boolean;
    // 应用标题
    appTitle: string;
}

// 获取环境变量
const env = import.meta.env;

// 判断当前环境
const isDev = env.MODE === 'development';

const config: Config = {
    // 环境标识
    env: env.MODE as 'development' | 'production',
    // API 基础URL
    apiBaseUrl: env.VITE_API_BASE_URL || '/api',
    // 接口超时时间（毫秒）
    timeout: Number(env.VITE_API_TIMEOUT) || (isDev ? 30000 : 50000),
    // 是否为开发环境
    isDev,
    // 应用标题
    appTitle: env.VITE_APP_TITLE || 'ZZZ Blog',
}
export default config;