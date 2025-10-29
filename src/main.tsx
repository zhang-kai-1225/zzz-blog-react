import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import '@/styles/index.css'
import App from './App.tsx'
import { initializeTheme } from './store/modules/themeSlice'
import { ToastProvider, ToastListener, initAdnaanUI } from 'adnaan-ui';
// 初始化Adnaan UI
initAdnaanUI();
// 初始化主题
const init = async () => {
  const dispatch = store.dispatch;
  dispatch(initializeTheme());
  createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <ToastProvider>
          <ToastListener />
          <App />
        </ToastProvider>
    </Provider>
  </StrictMode>,
)
}
init();


