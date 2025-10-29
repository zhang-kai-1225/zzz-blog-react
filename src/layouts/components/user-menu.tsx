import styled from '@emotion/styled';
import { FiLogIn, FiLogOut, FiUser, FiUserPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { logoutUser } from '@/store/modules/userSlice';
import type { AppDispatch } from '@/store';
import type { RefObject } from 'react';
const Avatar = styled.div<{ hasImage?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: ${(props) => (props.hasImage ? '2px solid var(--accent-color-alpha)' : 'none')};
  transition: all 0.2s ease;
  margin-left: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
    border-color: ${(props) => (props.hasImage ? 'var(--accent-color)' : 'none')};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;
// 移动端头像样式
export const MobileAvatar = styled(Avatar)`
  display: none;
  margin-right: 0.5rem;
  margin-left: 0;
`;
const UserDropdownContent = styled(motion.div)`
 position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 220px;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;

  [data-theme='dark'] & {
    background: var(--bg-secondary);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;
// 定义动画变体
export const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as any,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1] as any,
    },
  },
};
const UserDropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
`;

const UserRole = styled.div<{ roleColor?: string }>`
  font-size: 0.8rem;
  color: ${(props) => props.roleColor || 'var(--text-secondary)'};
  font-weight: 500;
`;

const UserDropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  font-size: 0.95rem;
  gap: 0.75rem;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  [data-theme='dark'] &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  svg {
    color: var(--text-tertiary);
  }
`;

const UserDropdownLogout = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  color: var(--danger-color);
  transition: all 0.2s ease;
  font-size: 0.95rem;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  border-top: 1px solid var(--border-color);

  &:hover {
    background: var(--bg-secondary);
  }

  [data-theme='dark'] &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  svg {
    color: var(--danger-color);
  }
`;
// 用户菜单属性接口
interface UserMenuProps {
  toggleUserDropdown: (e?: React.MouseEvent<Element, MouseEvent>) => void;
  userDropdownOpen: boolean;
  handleLinkClick: () => void;
  userDropdownRef: RefObject<HTMLDivElement>;
  handleLogin: () => void;
  handleRegister: () => void;
}
// 用户菜单组件
const UserMenu: React.FC<UserMenuProps> = ({
  toggleUserDropdown,
  userDropdownOpen,
  handleLinkClick,
  userDropdownRef,
  handleLogin,
  handleRegister,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  // 从本地存储中获取用户登录状态
  const { isLoggedIn, user } = useSelector((state: any) => state.user);
  // 处理登出
  const handleLogout = () => {
    dispatch(logoutUser());
    handleLinkClick();
  };
  return (
    <div ref={userDropdownRef} style={{ position: 'relative' }}>
      {isLoggedIn ? (
        <Avatar onClick={toggleUserDropdown} hasImage>
          <img src={user.avatar} alt={user.username} />
        </Avatar>
      ) : (
        <Avatar onClick={toggleUserDropdown}>
          <FiUser color="var(--text-secondary)" />
        </Avatar>
      )}
      <AnimatePresence>
        {userDropdownOpen && (
          <UserDropdownContent initial="hidden" animate="visible" exit="hidden" variants={dropdownVariants}>
            {isLoggedIn ? (
              <>
                <UserDropdownHeader>
                  <Avatar>
                    {
                      user?.avatar ? (
                        <img src={user.avatar} alt={user.username} />
                      ) : (
                        <FiUser color="var(--text-secondary)" />
                      )
                    }
                  </Avatar>
                  <UserInfo>
                    <UserName>{user?.username}</UserName>
                    <UserRole>111</UserRole>
                  </UserInfo>
                </UserDropdownHeader>
                <UserDropdownItem to="/profile">
                  <FiUser size={16} /> 个人中心
                </UserDropdownItem>
                <UserDropdownLogout onClick={handleLogout}>
                  <FiLogOut size={16} /> 退出登录
                </UserDropdownLogout>
              </>
            ) : (
              <>
                <UserDropdownItem to="#" onClick={handleLogin}>
                  <FiLogIn size={16} /> 登录
                </UserDropdownItem>
                <UserDropdownItem to="#" onClick={handleRegister}>
                  <FiUserPlus size={16} /> 注册
                </UserDropdownItem>
              </>

            )}
          </UserDropdownContent>
        )}
      </AnimatePresence>
    </div>
  )
}
export default UserMenu;