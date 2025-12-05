import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeaderContainer, 
  Logo, 
  Nav, 
  SubMenuWrapper, 
  SubMenuContainer, 
  SubMenuColumn,
  SubMenuTitle, // 👈 추가된 컴포넌트
  SubMenuLink 
} from './Header.styled';

const Header = ({ onCartClick }) => {
  const navigate = useNavigate();
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);

  const subMenuData = [
    {
      title: "올버즈",
      items: ["브랜드 스토리", "지속 가능성", "소재", "수선"]
    },
    {
      title: "스토리",
      items: ["올멤버스", "올버즈 엠배서더", "ReRun", "신발 관리 방법"]
    },
    {
      title: "소식",
      items: ["캠페인", "뉴스"]
    }
  ];

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate('/')}>ALLBIRDS</Logo>

      <Nav>
        <ul>
          {/* 1. 슈퍼 블랙 프라이데이 */}
          <li onClick={() => navigate('/black-friday')} style={{ color: '#d9534f' }}>
            슈퍼 블랙 프라이데이
          </li>

          {/* 2. 매장 위치 */}
          <li onClick={() => navigate('/stores')}>매장 위치</li>

          {/* 3. 지속 가능성 */}
          <li 
            onMouseEnter={() => setIsSubMenuVisible(true)}
            onMouseLeave={() => setIsSubMenuVisible(false)}
            style={{ fontWeight: 'bold', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            지속가능성
            
            <SubMenuWrapper $isVisible={isSubMenuVisible}>
              <SubMenuContainer>
                {subMenuData.map((section, idx) => (
                  <SubMenuColumn key={idx}>
                    {/* ✨ 여기에만 애니메이션 적용됨 ✨ */}
                    <SubMenuTitle>{section.title}</SubMenuTitle>
                    <ul>
                      {section.items.map((item, i) => (
                        <li key={i}>
                          {/* 하위 메뉴는 애니메이션 제거됨 */}
                          <SubMenuLink href="#">{item}</SubMenuLink>
                        </li>
                      ))}
                    </ul>
                  </SubMenuColumn>
                ))}
              </SubMenuContainer>
            </SubMenuWrapper>
          </li>
        </ul>
      </Nav>

      <div>
        <span onClick={onCartClick} style={{ cursor: 'pointer', marginRight: '20px', fontSize: '20px' }}>🛒</span>
        <span onClick={() => navigate('/mypage')} style={{ cursor: 'pointer', fontSize: '20px' }}>👤</span>
      </div>
    </HeaderContainer>
  );
};

export default Header;