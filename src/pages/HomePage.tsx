import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

// 页面容器
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`;

// 欢迎区域
const WelcomeSection = styled.section`
  text-align: center;
  padding: ${theme.spacing['3xl']} 0;
  background: linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.info}20);
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing['2xl']};
`;

const WelcomeTitle = styled.h1`
  font-size: ${theme.fontSize['4xl']};
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSize['3xl']};
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSize.lg};
  }
`;

// 功能区域
const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing['2xl']};
`;

const FeatureCard = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  font-size: ${theme.fontSize['3xl']};
  margin-bottom: ${theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
`;

const HomePage: React.FC = () => {
  return (
    <PageContainer>
      <WelcomeSection>
        <WelcomeTitle>欢迎来到 ZZZ Blog</WelcomeTitle>
        <WelcomeSubtitle>
          这里是一个技术分享平台，专注于前端开发、React、TypeScript等技术领域的知识分享与交流
        </WelcomeSubtitle>
      </WelcomeSection>

      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon>📝</FeatureIcon>
          <FeatureTitle>技术文章</FeatureTitle>
          <FeatureDescription>
            分享最新的前端技术文章，包括React、Vue、TypeScript等热门技术栈的深度解析
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🏷️</FeatureIcon>
          <FeatureTitle>分类管理</FeatureTitle>
          <FeatureDescription>
            按照技术栈和主题对文章进行分类，方便读者快速找到感兴趣的内容
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>💡</FeatureIcon>
          <FeatureTitle>学习笔记</FeatureTitle>
          <FeatureDescription>
            记录学习过程中的心得体会，分享实际项目开发中的经验和技巧
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </PageContainer>
  );
};

export default HomePage;