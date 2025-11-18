import { useAnimationEngine, useSmartInView } from "@/utils/animation-engine";
import type { ArticlesSectionProps } from "./types";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { RefObject } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const ContentSection = styled(motion.section)`
    margin-bottom: 2.5rem;
    overflow-x: hidden;
`

const SectionTitle = styled(motion.h2)`
    font-size: 1.3rem;
    font-weight: 600;
    margin: 2rem 0 1.25rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    /* 为标题添加装饰线 */
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-color), transparent);
    border-radius: 3px;
  }
`

const ArticleGrid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-x: hidden; /* 防止横向滚动条 */
  padding: 0 12px;
`;
const ArticleCard = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  position: relative;
  /* 优化性能，防止抖动 */
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;

  /* 左侧彩色指示点 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: var(--accent-color);
    border-radius: 50%;
    opacity: 0.7;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  &:hover {
    &::before {
      opacity: 1;
      transform: translateY(-50%) scale(1.2);
    }
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  [data-theme='dark'] & {
    border-bottom-color: rgba(75, 85, 99, 0.5);
  }
`;

// ArticleLink 组件
interface ArticleLinkProps {
    to: string;
    children: React.ReactNode;
    variants?: any;
    custom?: any;
    initial?: string;
    animate?: string;
    whileHover?: any;
    transition?: any;
}
const ArticleLink: React.FC<ArticleLinkProps> = ({ to, children, ...props }) => (
    <Link to={to} style={{ textDecoration: 'none' }} >
        <ArticleCard {...props}>{children}</ArticleCard>
    </Link>
)
export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles = [], loading = false }) => {
    // 使用动画引擎 - Spring 系统
    const { variants, springPresets } = useAnimationEngine();
    // 使用智能视口检测 - 修复刷新时可见度问题
    const containerView = useSmartInView({ amount: 0.2, lcpOptimization: true });
    const titleView = useSmartInView({ amount: 0.3 });
    const gridView = useSmartInView({ amount: 0.1 });
    if (loading) return null;


    return (
        <ContentSection ref={containerView.ref as RefObject<HTMLDivElement>} initial="hidden" animate={containerView.isInView ? "visible" : "hidden"} variants={variants.fadeIn}>
            <SectionTitle ref={titleView.ref as RefObject<HTMLDivElement>} initial="hidden" animate={titleView.isInView ? "visible" : "hidden"} variants={variants.slideInLeft} transition={springPresets.gentle}>
                技术文思的「新地球」
                <Link to="/blog" style={{ textDecoration: 'none' }}>
                    <motion.span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: 'var(--accent-color)',
                            fontSize: '0.85rem',
                        }}
                        whileHover={{ x: 5 }}
                        transition={springPresets.bouncy}
                    >
                        还有更多 <FiArrowRight size={12} />
                    </motion.span>
                </Link>
            </SectionTitle>
            <ArticleGrid ref={gridView.ref as RefObject<HTMLDivElement>} initial="hidden" animate={gridView.isInView ? "visible" : "hidden"} variants={variants.stagger}>
                {articles.slice(0, 3).map((article) => (
                    <ArticleLink to={`/blog/${article.id}`} key={article.id} variants={variants.listItem} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                        {article.title}
                    </ArticleLink>
                ))}
            </ArticleGrid>
        </ContentSection>
    )
}