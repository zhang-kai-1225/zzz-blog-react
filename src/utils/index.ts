// 本地存储工具对象（对localStorage和sessionStorage的封装）
export const storage = {
    // 本地存储
    local: {
        // 1、 读取本地存储项
        get<T>(key: string): T | null {
            const value = localStorage.getItem(key);
            try {
                if (value) {
                    return JSON.parse(value);
                }
            } catch (error) {
                console.error('Error parsing JSON from localStorage:', error);
                return value as unknown as T;
            }
            return null;
        },
        // 2、 写入本地存储项
        set<T>(key: string, value: T): void {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Error stringifying value to JSON for localStorage:', error);
            }
        },
        // 3、 删除本地存储项
        remove(key: string): void {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Error removing item from localStorage:', error);
            }
        },
    },
    // 会话存储
    session: {
        // 1、 读取会话存储项
        get<T>(key: string): T | null {
            const value = sessionStorage.getItem(key);
            try {
                if (value) {
                    return JSON.parse(value);
                }
            } catch (error) {
                console.error('Error parsing JSON from sessionStorage:', error);
                return value as unknown as T;
            }
            return null;
        },
        // 2、 写入会话存储项
        set<T>(key: string, value: T): void {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Error stringifying value to JSON for sessionStorage:', error);
            }
        },
        // 3、 删除会话存储项
        remove(key: string): void {
            try {
                sessionStorage.removeItem(key);
            } catch (error) {
                console.error('Error removing item from sessionStorage:', error);
            }
        },
    },

}