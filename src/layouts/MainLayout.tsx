import styled from '@emotion/styled';
import Header from './Header';
import Footer from './Footer';

import { Outlet } from 'react-router-dom';

// 容器
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
// 主要内容容器
const MainContent = styled.main`
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  padding: 2rem 0;
`;
const MainLayout: React.FC = () =>{
  return(
    <>
    <AppContainer>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent> 
      <Footer />
    </AppContainer>
    </>
  )
}
export default MainLayout;