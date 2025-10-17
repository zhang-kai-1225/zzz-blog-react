import styled from '@emotion/styled';
const PageContainer = styled.div`
  padding: 2rem 0;
`;
const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;
const PlaceholderContent = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
`;
const PlaceholderText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #888;
`;
const CodePage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>代码列表</PageTitle>
      <PlaceholderContent>
        <PlaceholderText>
          这里将展示所有的代码。<br />
          您可以按照不同的项目来浏览代码。
        </PlaceholderText>
      </PlaceholderContent>
    </PageContainer>
  );
};
export default CodePage;