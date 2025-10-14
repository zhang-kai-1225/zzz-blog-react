import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']};
  text-align: center;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: ${theme.fontSize['2xl']};
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`;

const ErrorDescription = styled.p`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
  max-width: 500px;
  line-height: 1.6;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.textInverse};
  text-decoration: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: 500;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <PageContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>页面未找到</ErrorTitle>
      <ErrorDescription>
        抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
      </ErrorDescription>
      <BackButton to="/">返回首页</BackButton>
    </PageContainer>
  );
};

export default NotFoundPage;
