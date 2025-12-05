import React from 'react';
import {
  FooterContainer,
  FooterTop,
  FooterLeftTop,
  FooterRightTop,
  FooterBottom,
  FooterLeftBottom,
  FooterRightBottom,
  SocialLinks,
  LegalLinks,
} from './Footer.styled';

const Footer = () => {
  return (
    <FooterContainer>
      
      {/* 상단 */}
      <FooterTop>
        <FooterLeftTop>
          <h2>올멤버스 가입하기</h2>
          <h2>오프라인 매장 찾기</h2>
          <h2>카카오 채널 추가하기</h2>
          <h2>올버즈 브랜드 스토리</h2>
        </FooterLeftTop>

        <FooterRightTop>
          <h3>올버즈 지원</h3>
          <ul>
            <li>교환 및 반품</li>
            <li>수선</li>
            <li>문의하기</li>
            <li>FAQ</li>
            <li>채용</li>
          </ul>
        </FooterRightTop>
      </FooterTop>

      {/* 하단 */}
      <FooterBottom>
        {/* 왼쪽 하단 */}
        <FooterLeftBottom>
          <p className="highlight">ALLBIRDS를 팔로우 하세요!</p>
          <p>
          최신 정보나 Allbirds 상품의 스냅샷 등<br/>
          을 보실 수 있습니다. 오! 물론 귀여운 양<br/>
          도 보실 수 있죠. #weareallbirds #올버즈
          </p>
          <SocialLinks>
            <span>Instagram</span>
            <span>Facebook</span>
            <span>Youtube</span>
          </SocialLinks>
          <LegalLinks>
            <span>© 2025 EFG.CO All Rights Reserved.</span>
            <span>이용 약관</span> | <span>개인정보 처리방침</span>
          </LegalLinks>
        </FooterLeftBottom>

        {/* 오른쪽 하단 */}
<FooterRightBottom>
  {/* 이미지 박스 - 왼쪽 정렬 */}
  <div className="logo">
    <img src="/images/logo.png" alt="Logo" />
  </div>

  {/* 텍스트 박스 - 오른쪽 정렬 */}
  <div className="company-info">
    <p>
      (주)이에프쥐 대표 박제우 ㅣ 서울특별시 강남구 강남대로 160길 45<br/>
      통신판매업신고번호 2023-서울강남-04461 ㅣ 등록번호 146-81-03205<br/>
      전화번호 070-4138-0128(수신자 부담) ㅣ E-mail help@efg.earth
    </p>
  </div>
</FooterRightBottom>

      </FooterBottom>

    </FooterContainer>
  );
};

export default Footer;
