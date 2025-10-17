import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

const PlaceholderContent = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing['3xl']};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  text-align: center;
`;

const PlaceholderText = styled.p`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
`;

const NotesPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>笔记列表</PageTitle>
      <PlaceholderContent>
        <PlaceholderText>
          这里将展示所有的笔记。<br />
          您可以按照不同的主题来浏览笔记。
        </PlaceholderText>
      </PlaceholderContent>
    </PageContainer>
  );
};

export default NotesPage;
