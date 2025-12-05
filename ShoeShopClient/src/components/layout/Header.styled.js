import styled from 'styled-components';

export const HeaderContainer = styled.header`
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 50px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: 900;
  cursor: pointer;
  letter-spacing: 1px;
`;

export const Nav = styled.nav`
  height: 100%;

  > ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    height: 100%;
    align-items: center;
  }

  > ul > li {
    margin: 0 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 5px;
    }
  }
`;

export const SubMenuWrapper = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  width: 100vw;
  background-color: #fff;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  display: ${props => (props.$isVisible ? 'block' : 'none')};
  box-shadow: 0 5px 10px rgba(0,0,0,0.05);
  margin-left: -50vw;
  left: 50%;
  padding: 40px 0;
  z-index: 999;
  text-decoration: none;
  cursor: default; /* 배경 커서 초기화 */
`;

export const SubMenuContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 50px;
  gap: 120px;
`;

export const SubMenuColumn = styled.div`
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 15px;
  }
`;

// ✨ 애니메이션이 적용된 제목 컴포넌트 (기존 h4 대체) ✨
export const SubMenuTitle = styled.h4`
  font-size: 18px; 
  color: #212a2f;
  margin: 0 0 25px 0;
  font-weight: 800; 
  letter-spacing: 0.5px;
  
  /* 애니메이션 필수 설정 */
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* 애니메이션 줄 */
  &::before {
    content: '';
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 3px; /* 제목이라 조금 더 두껍게 */
    background-color: #212a2f;
    transition: width 0.3s ease-in-out;
  }

  &:hover {
    transform: translateX(20px); /* 오른쪽 이동 */
  }

  &:hover::before {
    width: 15px; /* 줄 생성 */
  }
`;

// ✨ 애니메이션 제거된 일반 링크 ✨
export const SubMenuLink = styled.a`
  text-decoration: none;
  color: #4a4a4a;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #212a2f;
    text-decoration: underline; /* 심플하게 밑줄만 표시 */
    text-underline-offset: 3px;
  }
`;