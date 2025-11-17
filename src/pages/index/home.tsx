import Icon from "@/components/common/Icon"
import WaveText from "@/components/common/wave-text"
import { useAnimationEngine } from "@/utils/animation-engine"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { useState } from "react"
import { FiCode, FiGithub, FiMail } from "react-icons/fi"
import { useSiteSettings } from "@/layouts/hook.ts";



const PageContainer = styled.div`
    width: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1rem;
`
const Hero = styled(motion.div)`
   width: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   flex:1;
   @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    margin-bottom:2rem
   }
`
const HeroContent = styled(motion.div)`
    max-width: 800px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;

    &::before {
        content: '';
        position: absolute;
        top: -10px;
        left: -30px;
        width: 80px;
        height: 80px;
        background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
        border-radius: 50%;
        z-index: -1;
        opacity: 0.5;
        filter: blur(20px);
    }
    @media(max-width: 768px) {
        max-width: 100%;
        text-align:center;
        order: 2;
        padding: 0 ;

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
`
const Title = styled.h1`
    font-size: 2.4rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap:10px;
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin-bottom: 1rem;

    &:after{
        content: '';
        display: block;
        position: absolute;
        bottom:-5px;
        left: 0;
        width: 40px;
        height: 5px;
        background-color: var(--accent-color);
        border-radius: 2px;
        transform: translateY(20px);
        opacity: 0;
    }
    @media(max-width: 768px) {
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
      transform: rotate(30deg);
    }
    20% {
      transform: rotate(-30deg);
    }
    30% {
      transform: rotate(30deg);
    }
    40% {
      transform: rotate(-10deg);
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
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    justify-content: center;
  }
`

/**
 * 单个字符容器 - 支持波浪动画
 *
 * 用于需要单独样式控制的字符（如渐变色、加粗等）
 * 对于纯文本波浪效果，推荐使用 WaveText 组件
 */
const AnimatedChar = styled(motion.span)`
  display: inline-block;
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
`;
const Discription = styled(motion.p)`
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    max-width: 90%;

    @media (max-width: 768px) {
     max-width: 100%;
    }
`;
const SkillTags = styled(motion.div)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  display: flex;
  gap: 0.8rem;
  opacity: 0.85;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const SocialLinks = styled(motion.div)`
 display: flex;
  gap: 0.85rem;
  margin-top: 5rem;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: -1rem;
    left: 0;
    width: 3rem;
    height: 2px;
    background: var(--border-color);

    @media (max-width: 768px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialLink = styled(motion.a)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: var(--accent-color);
    background-color: rgba(81, 131, 245, 0.06);
    box-shadow: inset 0 0 0 1px rgba(81, 131, 245, 0.1);
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const HeroImage = styled(motion.div)`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    z-index: 1;
`

const ProfileCard = styled(motion.div)`
     width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform-origin: center center;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(var(--accent-rgb), 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  will-change: transform;

  &:hover:not(.flipped) {
    transform: translateY(-8px);
    box-shadow:
      0 16px 48px rgba(var(--accent-rgb), 0.3),
      0 8px 24px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  &.flipped {
    transform: rotateY(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    &.flipped {
      transform: rotateY(180deg);
    }
  }
`
const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 16px;
  overflow: hidden;
`;
const CardFront = styled(CardFace)`
    width: 100%;
    height: 100%;
    background-color: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`
const CardBack = styled(CardFace)`
    width: 100%;
    height: 100%;
    background-color: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    transform: rotateY(180deg);
`
const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.5);
  margin-bottom: 1.2rem;
  flex-shrink: 0;
  box-shadow:
    0 8px 24px rgba(var(--accent-rgb), 0.3),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
  }

  [data-theme='dark'] & {
    border: 3px solid rgba(255, 255, 255, 0.3);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.4),
      0 4px 12px rgba(var(--accent-rgb), 0.2),
      inset 0 2px 4px rgba(255, 255, 255, 0.15);
  }
`;
const Home: React.FC = () => {
    // 使用动画引擎， 统一的Spring动画系统
    const { variants, springPresets } = useAnimationEngine();
    // 卡片是否翻转
    const [isFlipped, setIsFlipped] = useState(false);
    // 按行显示控制
    const [showLine1, setShowLine1] = useState(true);
    const [showLine2, setShowLine2] = useState(false);
    const [showLine3, setShowLine3] = useState(false);
    const [showLine4, setShowLine4] = useState(false);
    const [showRest, setShowRest] = useState(false); // 技能标签和社交链接

    // 使用网站设置Hook - 增加加载状态检查
    const { siteSettings, loading: siteSettingsLoading } = useSiteSettings();





    const handleCardFlip = () => {
        setIsFlipped(!isFlipped);
    };
    return (
        <>
            <PageContainer>
                <Hero>
                    <HeroContent>
                        {/** 标题 */}
                        <Title>
                            <motion.span variants={variants.waveContainer} initial="hidden" animate={showLine1 ? 'visible' : 'hidden'} style={{ display: 'inline-block' }} onAnimationComplete={(definition) => {
                                if (definition === 'visible' && showLine1) {
                                    setShowLine2(true);
                                }
                            }}>
                                {'欢迎踏入代码与创意交织的'.split('').map((char, index) => (
                                    <AnimatedChar key={index} variants={variants.waveChar}>
                                        {char}
                                    </AnimatedChar>
                                ))}{' '}
                                <span>
                                    {'奇幻宇宙'.split('').map((char, index) => (
                                        <AnimatedChar key={index} variants={variants.waveChar}>
                                            {char}
                                        </AnimatedChar>
                                    ))}
                                </span>
                            </motion.span>
                            <motion.span
                                className="wave"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={showLine1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                                transition={{ delay: showLine1 ? 0.5 : 0, ...springPresets.snappy }}
                                style={{
                                    display: 'inline-block',
                                    fontSize: '0.8em',
                                }}
                            >
                                🌌
                            </motion.span>
                        </Title>
                        {/** 第二行 */}
                        <Subtitle>
                            <motion.span variants={variants.waveContainer} initial="hidden" animate={showLine2 ? 'visible' : 'hidden'} style={{ display: 'inline-block' }} onAnimationComplete={(definition) => {
                                if (definition === 'visible' && showLine2) {
                                    setShowLine3(true);
                                }
                            }}>
                                {'我是一个前端开发人员，喜欢创建有趣的项目'.split('').map((char, index) => (
                                    <AnimatedChar key={index} variants={variants.waveChar} style={{ background: 'linear-gradient(90deg, rgb(var(--gradient-from)), rgb(var(--gradient-to)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {char}
                                    </AnimatedChar>
                                ))}
                                <AnimatedChar variants={variants.waveChar}> </AnimatedChar>
                                <motion.code
                                    variants={variants.waveChar}
                                    style={{
                                        display: 'inline-block',
                                        color: 'var(--accent-color)',
                                        fontFamily: 'var(--font-code)',
                                        background: 'rgba(81, 131, 245, 0.08)',
                                        padding: '0.2em 0.4em',
                                        borderRadius: '4px',
                                        fontSize: '0.85em',
                                        marginLeft: '0.5em',
                                        border: '1px solid rgba(81, 131, 245, 0.1)',
                                    }}
                                >
                                    @zzZZ
                                </motion.code>
                            </motion.span>
                        </Subtitle>
                        {/** 第三行 */}
                        <Discription initial={{ opacity: 0 }} animate={showLine3 ? { opacity: 1 } : { opacity: 0 }}>
                            <motion.span
                                variants={variants.waveContainer}
                                initial="hidden"
                                animate={showLine3 ? 'visible' : 'hidden'}
                                style={{ display: 'inline' }}
                                onAnimationComplete={(definition: any) => {
                                    if (definition === 'visible' && showLine3) {
                                        setShowLine4(true);
                                    }
                                }}
                            >
                                {'我是'.split('').map((char, i) => (
                                    <AnimatedChar key={i} variants={variants.waveChar}>
                                        {char}
                                    </AnimatedChar>
                                ))}
                                <strong style={{ color: 'var(--accent-color)' }}>
                                    {'全栈工程师'.split('').map((char, i) => (
                                        <AnimatedChar key={`s1-${i}`} variants={variants.waveChar}>
                                            {char}
                                        </AnimatedChar>
                                    ))}
                                </strong>
                                {'与'.split('').map((char, i) => (
                                    <AnimatedChar key={`and-${i}`} variants={variants.waveChar}>
                                        {char}
                                    </AnimatedChar>
                                ))}
                                <strong style={{ color: 'var(--accent-color)' }}>
                                    {'UI/UX爱好者'.split('').map((char, i) => (
                                        <AnimatedChar key={`s2-${i}`} variants={variants.waveChar}>
                                            {char}
                                        </AnimatedChar>
                                    ))}
                                </strong>
                                {'，专注于构建美观且高性能的Web体验。'.split('').map((char, i) => (
                                    <AnimatedChar key={`end-${i}`} variants={variants.waveChar}>
                                        {char}
                                    </AnimatedChar>
                                ))}
                            </motion.span>
                            <br />
                            {/* 第4行：「每一行代码都有诗意，每一个像素都有故事」- 带渐变下划线 */}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={showLine4 ? { opacity: 1 } : { opacity: 0 }}
                                style={{
                                    fontSize: '0.9em',
                                    opacity: 0.9,
                                    display: 'inline-block',
                                    position: 'relative',
                                    paddingBottom: '0.25rem',
                                }}
                            >
                                <WaveText show={showLine4} onComplete={() => setShowRest(true)}>
                                    「每一行代码都有诗意，每一个像素都有故事」
                                </WaveText>
                                <motion.span
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={showLine4 ? { opacity: 0.3, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        width: '100%',
                                        height: '2px',
                                        background: 'linear-gradient(90deg, var(--accent-color), transparent)',
                                        transformOrigin: 'left',
                                    }}
                                />
                            </motion.span>
                        </Discription>
                        <SkillTags
                            initial={{ opacity: 0, y: 10 }}
                            animate={showRest ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={springPresets.gentle}
                        >
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
                        <SocialLinks
                            initial={{ opacity: 0, y: 10 }}
                            animate={showRest ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ ...springPresets.gentle, delay: 0.2 }}
                        >
                            <SocialLink
                                href={siteSettings?.socialLinks?.email ? `mailto:${siteSettings.socialLinks.email}` : undefined}
                                aria-label="Email"
                                initial={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -3, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={springPresets.bouncy}
                            >
                                <FiMail />
                            </SocialLink>
                            <SocialLink
                                href={siteSettings?.socialLinks?.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                initial={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -3, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={springPresets.bouncy}
                            >
                                <FiGithub />
                            </SocialLink>
                            <SocialLink
                                href={siteSettings?.socialLinks?.bilibili}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Bilibili"
                                initial={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -3, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={springPresets.bouncy}
                                style={{
                                    background:
                                        'linear-gradient(135deg, rgba(var(--gradient-from), 0.08), rgba(var(--gradient-to), 0.08))',
                                }}
                            >
                                <Icon name="bilibili" size={18} />
                            </SocialLink>
                            <SocialLink
                                href={siteSettings?.socialLinks?.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                                initial={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -3, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={springPresets.bouncy}
                            >
                                <Icon name="telegram" size={18} />
                            </SocialLink>
                            <SocialLink
                                href={siteSettings?.socialLinks?.rss}
                                aria-label="RSS Feed"
                                initial={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -3, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={springPresets.bouncy}
                            >
                                <Icon name="rss" size={18} />
                            </SocialLink>
                        </SocialLinks>

                    </HeroContent>
                    {/**个人卡片 */}
                    <HeroImage
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={springPresets.bouncy}>
                        <ProfileCard className={isFlipped ? 'flipped' : ''} onClick={handleCardFlip}>
                            <CardFront>
                                <ProfileImage>
                                    <img
                                        src="https://foruda.gitee.com/avatar/1745582574310382271/5352827_adnaan_1745582574.png!avatar100"
                                        alt={siteSettings?.authorName || '头像'}
                                    />
                                </ProfileImage>

                            </CardFront>
                            <CardBack>

                            </CardBack>
                        </ProfileCard>

                    </HeroImage>

                </Hero>
            </PageContainer>
        </>
    )
}

export default Home