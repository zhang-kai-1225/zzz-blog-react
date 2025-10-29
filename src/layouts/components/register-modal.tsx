import type { AppDispatch, RootState } from "@/store";
import styled from "@emotion/styled";
import { Input, Modal } from "adnaan-ui";
import { useState } from "react";
import { FiFacebook, FiGithub, FiMail, FiTwitter, FiUser } from "react-icons/fi";
import { FiLock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}
const ModalContent = styled.div`
    padding: 2rem;
`
const Title = styled.h2`
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-align: center;
`
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;

`
const SubmitButton = styled.button`
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background: var(--accent-color);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    filter: none;
  }
`;
const SwitchButton = styled.button`
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--accent-color);
    text-decoration: underline;
    filter: brightness(1.2);
  }

  &:active {
    transform: translateY(1px);
    filter: brightness(0.9);
  }
`
// 社交注册按钮组
const SocialRegisterGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
`;
// 社交注册按钮
const SocialButton = styled.button`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--bg-tertiary);
    transform: translateY(-2px);
  }
`;
const ErrorMessage = styled.div`
  color: var(--danger-color);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;
const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <Title>注册</Title>
                <Form>
                    <Input
                        type="text"
                        name="username"
                        placeholder="用户名"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        leftIcon={<FiUser size={18} />}
                    />
                    <Input
                        type="email"
                        name="email"
                        placeholder="邮箱"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        leftIcon={<FiMail size={18} />}
                    />

                    <Input
                        type="password"
                        name="password"
                        placeholder="密码"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        leftIcon={<FiLock size={18} />}
                    />

                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="确认密码"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        leftIcon={<FiLock size={18} />}
                    />

                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? '注册中...' : '注册'}
                    </SubmitButton>
                    <SwitchButton onClick={onSwitchToLogin}>已经有账号？登录</SwitchButton>
                </Form>
                <SocialRegisterGroup>
                    <SocialButton type="button">
                        <FiGithub size={24} />
                    </SocialButton>
                    <SocialButton type="button">
                        <FiTwitter size={24} />
                    </SocialButton>
                    <SocialButton type="button">
                        <FiFacebook size={24} />
                    </SocialButton>
                </SocialRegisterGroup>
            </ModalContent>
        </Modal>
    )
}
export default RegisterModal;