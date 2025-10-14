import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { Global } from '@emotion/react';
import Header from './Header';
import Footer from './Footer';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';

// 应用容器
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// 主内容区域
const MainContent = styled.main`
  flex: 1;
  background-color: ${theme.colors.backgroundSecondary};
  min-height: calc(100vh - 200px); // 减去header和footer的大概高度
`;

const MainLayout: React.FC = () => {
  return (
    <>
      <Global styles={globalStyles} />
      <AppContainer>
        <Header />
        <MainContent>
          <Outlet />
        </MainContent>
        <Footer />
      </AppContainer>
    </>
  );
};

export default MainLayout;