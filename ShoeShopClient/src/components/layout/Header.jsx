import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/App.context";
import {
  HeaderContainer,
  Logo,
  Nav,
  SubMenuWrapper,
  SubMenuContainer,
  SubMenuColumn,
  SubMenuTitle, 
  SubMenuLink,
} from "./Header.styled";

const Header = ({ onCartClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAppContext();
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);

  const subMenuData = [
    {
      title: "올버즈",
      items: ["브랜드 스토리", "지속 가능성", "소재", "수선"],
    },
    {
      title: "스토리",
      items: ["올멤버스", "올버즈 엠배서더", "ReRun", "신발 관리 방법"],
    },
    {
      title: "소식",
      items: ["캠페인", "뉴스"],
    },
  ];

  const handleUserIconClick = () => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin"); // 관리자라면 관리자 페이지로 이동
      } else {
        navigate("/mypage"); // 일반 고객이라면 마이페이지로 이동
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate("/")}>ALLBIRDS</Logo>

      <Nav>
        <ul>
          {/* 1. 슈퍼 블랙 프라이데이 */}
          <li
            onClick={() => navigate("/black-friday")}
            style={{ color: "#d9534f" }}
          >
            슈퍼 블랙 프라이데이
          </li>

          {/* 2. 매장 위치 */}
          <li onClick={() => navigate("/stores")}>매장 위치</li>

          {/* 3. 지속 가능성 */}
          <li
            onMouseEnter={() => setIsSubMenuVisible(true)}
            onMouseLeave={() => setIsSubMenuVisible(false)}
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
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
        <span
          onClick={onCartClick}
          style={{ cursor: "pointer", marginRight: "20px", fontSize: "20px" }}
        >
          🛒
        </span>
        {/* 로그인 상태에 따른 UI 변경 */}
        {user ? (
          <>
            <span
              onClick={handleUserIconClick}
              style={{
                cursor: "pointer",
                marginRight: "20px",
                fontWeight: "bold",
              }}
            >
              {user.name}님{user.role === "admin" ? "(관리자)" : ""}
            </span>
            <span
              onClick={logout}
              style={{ cursor: "pointer", fontSize: "14px", color: "#666" }}
            >
              로그아웃
            </span>
          </>
        ) : (
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", fontSize: "20px" }}
          >
            👤
          </span>
        )}
      </div>
    </HeaderContainer>
  );
};

export default Header;
