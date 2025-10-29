import styled from '@emotion/styled';
import Header from './Header';
import Footer from './Footer';

import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

// 容器
const AppContainer = styled.main`
  flex: 1;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  overflow: visible;
  margin-top: var(--header-height);
`;
// 主要内容容器
const MainContent = styled.main`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  position: relative;
`;
const MainLayout: React.FC = () =>{
  const [isScrolled, setIsScrolled] = useState(false);
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return(
    <>
    <AppContainer>
        <Header scrolled={isScrolled} />
      <MainContent>
        <Outlet />
      </MainContent> 
      <Footer />
    </AppContainer>
    </>
  )
}
export default MainLayout;