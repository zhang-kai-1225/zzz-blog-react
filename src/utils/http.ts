import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig, type InternalAxiosRequestConfig, AxiosError } from 'axios';
import config from './config';
import { storage } from './index';
import { HttpMethod, type ApiResponse, type ErrorResponse, type RequestConfig } from './type';

class HttpRequest {
    // 1. Axios实例，所有的请求都通过这个实例发送
    private instance: AxiosInstance;
    // 2. 基础配置（如基础URL、超时时间、默认头信息等）
    private baseconfig: AxiosRequestConfig;
    // 3. 记录是否已显示未授权错误，避免重复提示
    private hasShownUnauthorizedError = false;
    // 4. 错误提示防抖计时器（key：错误类型，value：计时器ID）
    private errorToastTimers = new Map<string, number>();
    // 构造函数，实例化类的时候自动执行 
    constructor(axiosConfig: AxiosRequestConfig = {}) {
        // 基础配置
        this.baseconfig = {
            baseURL: config.apiBaseUrl,
            timeout: config.timeout,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        // 创建axios实例，合并基础配置和传入的配置
        this.instance = axios.create({
            ...this.baseconfig,
            ...axiosConfig,
        });
        // 初始化拦截器
        this.setupInterceptors();
    }
    /**
     * 防抖显示错误提示
     * @param message 错误提示消息
     * @param title 错误提示标题
     * @param duration 防抖延迟时间，默认300ms
     * @param key 错误提示的key，用于防抖
     */
    private showErrorToast(key: string, message: string, title: string, duration: number = 3000): void {
        // 1. 如果该类型已经在防抖期间内，直接返回(避免重复提示)
        if (this.errorToastTimers.has(key)) {
            return;
        }
        // 2. 显示错误提示
        if (typeof window !== 'undefined' && (window as any).adnaan) {
            (window as any).adnaan.toast({
                message,
                title
            })
        }
        // 3. 设置防抖计时器： duration后清除该计时器
        const timer = setTimeout(() => {
            this.errorToastTimers.delete(key);
        }, duration)
        // 4. 存储计时器ID，用于后续清除
        this.errorToastTimers.set(key, timer);
    }
    /**
     * 清除所有的错误提示防抖计时器
     */
    private clearErrorToastTimer(): void {
        // 遍历Map清除所有计时器
        this.errorToastTimers.forEach((timer) => {
            clearTimeout(timer);
        })
        // 清空Map
        this.errorToastTimers.clear();
    }


    // 配置拦截器
    private setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            (reqConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
                // 从localStorage获取token
                const token = storage.local.get('token');
                if (token) {
                    reqConfig.headers.set('Authorization', `Bearer ${token}`);
                }
                // 根据全局配置判断环境，添加环境标识
                if (config.isDev) {
                    reqConfig.headers.set('X-Env', 'dev');
                }
                // 在发送请求之前做些什么
                return reqConfig;
            },
            (error: AxiosError) => {
                // 对请求错误做些什么
                return Promise.reject(error);
            }
        );
        // 响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse): AxiosResponse => {
                // 统一处理响应数据
                const { data } = response;
                // 统一处理全局状态 即使 HTTP 状态码是 2xx（表示请求成功到达服务器并返回），但后端可能通过 success: false 或 code >= 400 表示 “业务逻辑失败”（比如表单验证错误、权限不足等）。
                if (data.success === false || (data.code && data.code >= 400)) {
                    if (config.isDev) {
                        console.error('API响应错误:', {
                            url: response.config.url,
                            method: response.config.method,
                            status: response.status,
                            data,
                        });
                    }
                    // 处理全局错误状态
                    if (data.code === 401) {
                        if (!this.hasShownUnauthorizedError) {
                            this.hasShownUnauthorizedError = true;
                            if (typeof window !== 'undefined' && (window as any).adnaan) {
                                (window as any).adnaan.toast.error('登录过期，请重新登录', '身份验证失败');
                            }
                            // 清除localStorage中的token
                            storage.local.remove('token');
                            // 清除localStorage中的user
                            storage.local.remove('user');
                            // 1.5s后跳转登录页
                            setTimeout(() => {
                                window.location.href = '/';
                                this.hasShownUnauthorizedError = false;
                            }, 1500);
                        }
                    }
                    // 将业务逻辑错误包装为标准的ErrorResponse类型，抛给调用者处理
                    return Promise.reject({
                        success: false,
                        code: data.code,
                        message: data.message || '服务器响应异常',
                        data: null,
                        error: data.error,
                        meta: data.meta,

                    } as ErrorResponse) as any;
                }
                return response;
            },
            // 错误回调，该回调返回一个被拒绝的 Promise
            (error: AxiosError): Promise<AxiosError> => {
                const { response } = error;
                // 开发环境下，打印错误信息
                if (config.isDev) {
                    console.group('API响应错误');
                    console.error('错误信息:', error.message);
                    console.error('请求配置:', error.config);
                    console.error('响应状态:', response?.status);
                    console.error('响应数据:', response?.data);
                    console.groupEnd();
                }
                // 根据不同的状态码处理不同的错误
                if (response) {
                    const status = response.status;
                    switch (status) {
                        case 401:
                            // 未授权，清除token，并跳转登录页
                            if (!this.hasShownUnauthorizedError) {
                                this.hasShownUnauthorizedError = true;
                                if (typeof window !== 'undefined' && (window as any).adnaan) {
                                    (window as any).adnaan.toast.error('登录过期，请重新登录', '身份验证失败');
                                }
                                // 清除localStorage中的token
                                storage.local.remove('token');
                                // 清除localStorage中的user
                                storage.local.remove('user');
                                // 1.5s后跳转登录页
                                setTimeout(() => {
                                    window.location.href = '/';
                                    this.hasShownUnauthorizedError = false;
                                }, 1500);
                            }
                            break;
                        case 403:
                            // 拒绝访问，提示用户权限不足
                            if (config.isDev) {
                                console.error('访问被禁止')
                            }
                            this.showErrorToast('403', '您没有权限访问此资源', '访问被拒绝');
                            break;
                        case 404:
                            // 资源不存在
                            if (config.isDev) {
                                console.error('资源不存在')
                            }
                            // 404 通常不需要全局提示，由业务层处理
                            break;
                        case 500:
                            // 服务器错误
                            if (config.isDev) {
                                console.error('服务器错误')
                            }
                            this.showErrorToast('500', '服务器内部错误', '服务器错误', 5000);
                            break;
                        case 502:
                            // 网关错误
                            if (config.isDev) {
                                console.error('网关错误')
                            }
                            this.showErrorToast('502', '网关错误', '服务器错误', 5000);
                            break;
                        case 503:
                            // 服务不可用
                            if (config.isDev) {
                                console.error('服务不可用')
                            }
                            this.showErrorToast('503', '服务不可用', '服务器错误', 5000);
                            break;
                        case 504:
                            // 网关超时
                            if (config.isDev) {
                                console.error('网关超时')
                            }
                            this.showErrorToast('504', '网关超时', '服务器错误', 5000);
                            break;
                        default:
                            // 其他未知状态码，提示通用错误信息
                            if (config.isDev) {
                                console.error(`未知状态码: ${status}`)
                            }
                    }
                } else {
                    // 网络错误或请求被取消
                    if (config.isDev) {
                        console.error('网络错误或请求被取消')
                    }
                    // 只有在非取消请求的情况下，才提示网络错误
                    if (!axios.isCancel(error)) {
                        this.showErrorToast('network', '网络错误或请求被取消', '网络错误', 5000);
                    }
                }
                return Promise.reject(error);
            }
        );
    }
    /**
     * 创建请求
     * @param config 请求配置
     * @returns Promise<ApiResponse<T>>
     */
    public async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.request({
                ...config,
                method: config.method,
            });
            return response.data as ApiResponse<T>;
        } catch (error) {
            // 统一包装错误格式，确保返回ErrorResponse类型
            const err = error as ErrorResponse;
            throw err;  // 抛出错误，让业务层捕获
        }
    }
    /**
     * 文件上传请求
     * @param config 请求配置
     * @param formData - FormData对象
     * @param url - 请求URL
     * @returns Promise<AxiosResponse<T>> 
     */
    upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.post<T>(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            }
        });
    }
    /**
     * 下载文件
     * @param url - 请求URL
     * @param config - 请求配置
     * @returns Promise<AxiosResponse<T>>
     */
    download<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.get<T>(url, {
            ...config,
            responseType: 'blob',  // 关键：指定响应为 blob
        });
    }

    // Get请求
    public get<T = any>(
        url: string,
        params?: any,
        config?: Omit<RequestConfig, 'url' | 'method' | 'params'>,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            url,
            method: HttpMethod.GET,
            params,
            ...config,
        });
    }
    // POST 请求
    public post<T = any>(
        url: string,
        data?: any,
        config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            url,
            method: HttpMethod.POST,
            data,
            ...config,
        });
    }
    // PUT 请求
    public put<T = any>(
        url: string,
        data?: any,
        config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            url,
            method: HttpMethod.PUT,
            data,
            ...config,
        });
    }
    // PATCH 请求
    public patch<T = any>(
        url: string,
        data?: any,
        config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            url,
            method: HttpMethod.PATCH,
            data,
            ...config,
        });
    }
    /**
     * 流式POST请求（Server-Sent Events）
     * @param url - 请求URL
     * @param data - 请求数据
     * @param onChunk - 数据流回调
     * @returns Promise<string>
     */
    public async streamPost(url: string, data?: any, onChunk?: (chunk: string) => void): Promise<string> {
        const token = storage.local.get('token')
        const response = await fetch(`${this.baseconfig.baseURL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            // 特殊处理401错误
            if (response.status === 401) {
                if (!this.hasShownUnauthorizedError) {
                    this.hasShownUnauthorizedError = true
                    if (typeof window !== 'undefined' && (window as any).adnaan) {
                        (window as any).adnaan.toast.error('登录过期，请重新登录', '身份验证失败')
                    }
                    // 清除本地存储中的token和user信息
                    storage.local.remove('token')
                    storage.local.remove('user')
                    setTimeout(() => {
                        window.location.href = '/',
                            this.hasShownUnauthorizedError = false
                    }, 1500)
                }
            }
            throw new Error(`请求失败，状态码：${response.status} ${response.statusText}`)
        }
        // response.body 是 fetch 返回的可读流,getReader() 方法用于获取一个读取器对象,read() 方法用于读取流中的数据
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let result = '';
        // 若无法创建读取器对象（如响应体为空）抛出错误
        if (!reader) {
            throw new Error('无法创建读取器对象，响应体为空')
        }
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            // 将二进制数据转换为字符串
            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')
            // 处理每一行数据
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice('data: '.length));
                        if (data.type === 'chunk') {
                            result += data.data
                            onChunk?.(data.data)
                        } else if (data.type === 'done') {
                            return result
                        } else if (data.type === 'error') {
                            throw new Error(data.data)
                        }
                    } catch (error) {
                        console.error('解析SSE数据错误:', error)
                    }
                }
            }
        }
        return result

    }
}
//创建默认的请求实例
const http = new HttpRequest();
export default http;
export { HttpRequest }
