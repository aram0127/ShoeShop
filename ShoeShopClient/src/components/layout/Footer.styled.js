import styled from 'styled-components';

export const FooterContainer = styled.footer`
  width: 100%;
  background-color: #000000ff;
  padding: 50px 100px;
  display: flex;
  flex-direction: column;
  gap: 90px;
  color: #ffffffff;
`;

/* 상단 영역 */
export const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative; /* 오른쪽 Top 위치 조정을 위한 기준 */
`;

/* 왼쪽 큰 글자 */
export const FooterLeftTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    font-size: 40px;
    font-weight: 700;
    margin: 0;
  }
`;

/* 오른쪽 작은 글자 리스트 */
export const FooterRightTop = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 760px; /* 오른쪽 끝에서 50px 안쪽으로 */
  
  h3 {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding-left: 0;  /* 기본 패딩 제거 */
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  li {
    font-size: 16px;
  }
`;

/* 하단 전체 */
export const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 50px;
`;

/* 하단 왼쪽 */
export const FooterLeftBottom = styled.div`
  font-size: 14px;
  line-height: 1.5;

  .highlight {
    font-weight: 700;      // 굵게
    font-size: 16px;       // 조금 크게
    margin-bottom: 8px;    // 아래 여백
  }

  p {
    margin: 0 0 10px 0;    // 모든 p 동일한 간격
  }
`;


/* 하단 오른쪽 */
export const FooterRightBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* 이미지와 텍스트 사이 간격 */

  .logo {
    width: 120px;
    img {
      width: 70%;
      height: auto;
      display: block;
    }
  }

  .company-info {
    text-align: right;
    font-size: 14px;
    line-height: 1.5;
    padding-right:500px;
  }
`;



/* SNS 링크 */
export const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;

  span {
    cursor: pointer;
    font-weight: 600;
  }
`;

/* 법적 정보 */
export const LegalLinks = styled.div`
  font-size: 12px;
  color: #555;
  line-height: 1.5;

  span {
    margin-right: 10px;
  }
`;
