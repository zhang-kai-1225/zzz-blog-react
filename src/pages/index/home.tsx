import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useAnimationEngine } from "@/utils/animation-engine";
import { FiCode } from "react-icons/fi";
import { Icon } from "@/components/common/Icon";

const PageContainer = styled.div`
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1rem;
`;
const HeroSection = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    // background-color: red;

    @media (min-width:768px){
        min-height: 100vh;
        padding-bottom:2rem;
    }

`;
const Hero = styled(motion.div)`
  width: 100%;
  display: flex;
  position:relative;
  align-items: center;
  justify-content: space-between;
  flex:1;

  @media (min-width:768px){
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
  }
`;
const HeroContent = styled(motion.div)`
    max-width: 800px;
    position:L relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;

    &::before{
        content: '';
        position: absolute;
        top: -10px;
        left:-30px;
        width: 80px;
        height: 80px;
        background: radial-gradient(circle, var(--accent-color-alpha) 0%, transparent 70%);
        border-radius: 50%;
        opacity: 0.6;
        z-index: -1;
        filter: blur(10px);
    }
    &::after{
        content: '';
        position: absolute;
        bottom: 10%;
        right:-60px;
        width: 180px;
        height: 180px;
        background: radial-gradient(circle, rgba(var(--gradient-to), 0.08) 0%, transparent 70%);
        border-radius: 50%;
        z-index: -1;
        filter: blur(20px);
    }
    @media (max-width: 768px) {
        max-width: 100%;
        text-align: center;
        order: 2;
        padding: 0;

        &::before {
        left: 50%;
        transform: translateX(-50%);
        }

        &::after {
        right: 50%;
        transform: translateX(50%);
        width: 120px;
        height: 120px;
        }
  }
`;
const Title = styled(motion.h1)`
    font-size: 2.4rem;
    font-weight: 800;
    margin-bottom: 1rem;
    display:flex;
    align-items: center;
    gap:10px;
    letter-spacing: -0.5px;
    line-height: 1.1;

    &:after{
        content: '';
        display: block;
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 40px;
        height: 4px;
        background: var(--accent-color);
        border-radius: 2px;
        transform: translateY(20px);
        opacity: 0;
    }
    @media (max-width: 768px) {
      left: 50%;
      transform: translateX(-50%) translateY(20px);
    }
    .wave {
        display: inline-block;
        animation: wave 2.5s ease-in-out infinite;
        transform-origin: 70% 70%;
    }
    @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
    @media (max-width: 768px) {
        font-size: 1rem;
        justify-content: center;
  }

`;
const Subtitle = styled(motion.h2)`
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.2rem;
    line-height: 1.3;
    position: relative;

    code {
        font-family: var(--font-code);
        background: rgba(81, 131, 245, 0.08);
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.85em;
        margin-left: 0.5em;
        border: 1px solid rgba(81, 131, 245, 0.1);
    }

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }
`
const Description = styled(motion.p)`
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    max-width: 90%;

    span {
        position: relative;
        display: inline-block;
        padding: 0.2em 0;

        &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, var(--accent-color), transparent);
        opacity: 0.3;
        }
    }

    @media (max-width: 768px) {
        max-width: 100%;
    }
`
const SkillTags = styled(motion.div)`
    display: flex;
    gap: 0.8rem;
    align-items: center;
    color: var(--text-secondary);
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    opacity: 0.8;
    font-size: 1rem;

    @media (max-width: 768px) {
        justify-content: center;
        flex-wrap: wrap;
    }
    span{
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }   
`
const SociaLinks = styled(motion.div)`
   
`
const SociaLink = styled(motion.a)`
   
`
const Home: React.FC = () => {
    // 使用动画引擎
    const { variants } = useAnimationEngine();
    return (
        <>
            <PageContainer>
                <HeroSection>
                    <Hero>
                        <HeroContent variants={variants.fadeIn} initial="hidden" animate="visible">
                            <Title>
                                欢迎踏入代码与创意交织的<span style={{ color: 'var(--accent-color)' }}>奇幻宇宙</span>
                                <motion.span
                                    className="wave"
                                    // variants={variants.scale}
                                    initial="hidden"
                                    animate="visible"
                                    style={{
                                        display: 'inline-block',
                                        fontSize: '0.8em',
                                    }}
                                >
                                    🌌
                                </motion.span>
                            </Title>
                            <Subtitle variants={variants.fadeIn}>
                                <span style={{
                                    background: 'linear-gradient(90deg, rgb(var(--gradient-from)), rgb(var(--gradient-to)))',
                                    WebkitBackgroundClip: 'text',
                                    // WebkitTextFillColor: 'transparent',
                                    position: 'relative',
                                }}>
                                    探索、创造、分享
                                </span>
                                <code>@zzzZZZ</code>
                            </Subtitle>

                            <Description variants={variants.fadeIn}>
                                我是<strong style={{ color: 'var(--accent-color)' }}>全栈工程师</strong>与
                                <strong style={{ color: 'var(--accent-color)' }}>UI/UX爱好者</strong>，专注于构建美观且高性能的Web体验。
                                <br />
                                <span style={{ fontSize: '0.9em', opacity: 0.9 }}>「每一行代码都有诗意，每一个像素都有故事」</span>
                            </Description>
                            <SkillTags variants={variants.fadeIn}>
                                <span>
                                    <FiCode size={14} /> 开发者
                                </span>
                                <span>
                                    <Icon name="helpCircle" size={14} /> 设计爱好者
                                </span>
                                <span>
                                    <Icon name="share" size={14} /> 终身学习者
                                </span>
                            </SkillTags>

                            <SociaLinks variants={variants.stagger}>
                                <SociaLink>


                                </SociaLink>

                            </SociaLinks>

                        </HeroContent>
                    </Hero>
                </HeroSection>
            </PageContainer>
        </>
    )
}
export default Home;