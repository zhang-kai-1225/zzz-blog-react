import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

// 页脚容器
const FooterContainer = styled.footer`
  background-color: ${theme.colors.backgroundDark};
  color: ${theme.colors.textLight};
  padding: ${theme.spacing['2xl']} 0 ${theme.spacing.xl};
  margin-top: auto;
`;

// 页脚内容包装器
const FooterWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md};
  }
`;

// 页脚内容区域
const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing['2xl']};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

// 页脚区块
const FooterSection = styled.div`
  h3 {
    color: ${theme.colors.textInverse};
    font-size: ${theme.fontSize.lg};
    font-weight: 600;
    margin-bottom: ${theme.spacing.md};
  }
  
  p {
    color: ${theme.colors.textLight};
    line-height: 1.6;
    margin-bottom: ${theme.spacing.sm};
  }
  
  ul {
    list-style: none;
  }
  
  li {
    margin-bottom: ${theme.spacing.sm};
  }
  
  a {
    color: ${theme.colors.textLight};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;

// 页脚底部
const FooterBottom = styled.div`
  text-align: center;
  padding-top: ${theme.spacing.xl};
  border-top: 1px solid #333;
  color: ${theme.colors.textLight};
  font-size: ${theme.fontSize.sm};
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterWrapper>
        <FooterContent>
          {/* 博客信息 */}
          <FooterSection>
            <h3>ZZZ Blog</h3>
            <p>分享技术知识，记录学习成长</p>
            <p>专注于前端开发、React、TypeScript等技术领域</p>
          </FooterSection>
          
          {/* 快速链接 */}
          <FooterSection>
            <h3>快速链接</h3>
            <ul>
              <li><a href="/">首页</a></li>
              <li><a href="/articles">文章</a></li>
              <li><a href="/categories">分类</a></li>
              <li><a href="/about">关于</a></li>
            </ul>
          </FooterSection>
          
          {/* 社交媒体 */}
          <FooterSection>
            <h3>关注我</h3>
            <ul>
              <li><a href="#" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">掘金</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">知乎</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">微博</a></li>
            </ul>
          </FooterSection>
          
          {/* 联系信息 */}
          <FooterSection>
            <h3>联系方式</h3>
            <ul>
              <li><a href="mailto:contact@zzzblog.com">contact@zzzblog.com</a></li>
              <li><a href="/privacy">隐私政策</a></li>
              <li><a href="/terms">使用条款</a></li>
            </ul>
          </FooterSection>
        </FooterContent>
        
        <FooterBottom>
          <p>&copy; {currentYear} ZZZ Blog. All rights reserved.</p>
        </FooterBottom>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;
