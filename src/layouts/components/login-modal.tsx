import { Input, Modal } from 'adnaan-ui';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { FiFacebook, FiGithub, FiLock, FiTwitter, FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { login } from '@/store/modules/userSlice';
const ModalContent = styled.div`
    padding: 1.5rem 0;
`;
const Title = styled.h2`
    font-size: 1.2rem;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: center;
`;
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;
const SubmitButton = styled.button`
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem;
    margin-top: 1rem;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.2s ease;
    &:hover {
        background: var(--accent-color);
        color: white;
        transform: translateY(-2px);
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
const ToggleForm = styled.button`
    background: none;
    color: white;
    border: none;
    font-size: 0.95rem;
    cursor: pointer;
    padding:0.5rem;
    margin-top: 1rem;
    transition: all 0.2s ease;
    &:hover {
        color: var(--accent-color);
        text-decoration: underline;
        filter: brightness(1.2);
    }
    &:active {
        transform: translateY(0);
        filter: brightness(0.95);
    }
`;
const SocialLoginGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    justify-content: center;
`;
const SocialButton = styled.button`
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem ;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    &:hover {
        background: var(--bg-tertiary);
        transform: translateY(-2px);
    }
`;
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}
const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onSwitchToRegister,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, isLoggedIn } = useSelector((state: RootState) => state.user);
    // 表单数据状态
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    // 登录成功后关闭弹窗
    useEffect(() => {
        if (isLoggedIn) {
            onClose();
        }
    }, [isLoggedIn, onClose])
    // 表单提交处理
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await dispatch(login(formData.username, formData.password));
    }
    // 表单数据改变处理
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((pre) => ({
            ...pre,
            [name]: value,
        }));
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <Title>登录账号</Title>
                <Form onSubmit={handleSubmit}>
                    <Input type="text" name="username" placeholder="用户名" value={formData.username} required leftIcon={<FiUser size={18} />} onChange={handleChange}></Input>
                    <Input type="password" name="password" placeholder="密码" value={formData.password} required leftIcon={<FiLock size={18} />} onChange={handleChange}></Input>
                    <SubmitButton type="submit" disabled={loading}>{loading ? '登录中' : '登录'}</SubmitButton>
                    <ToggleForm type="button" onClick={onSwitchToRegister}>
                        还没有账号？去注册
                    </ToggleForm>
                </Form>
                <SocialLoginGroup>
                    <SocialButton type="button">
                        <FiGithub size={24} />
                    </SocialButton>
                    <SocialButton type="button">
                        <FiTwitter size={24} />
                    </SocialButton>
                    <SocialButton type="button">
                        <FiFacebook size={24} />
                    </SocialButton>
                </SocialLoginGroup>
            </ModalContent>
        </Modal>
    )
}

export default LoginModal;
