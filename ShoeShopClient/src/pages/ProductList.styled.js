// ProductList.styled.js

import styled, { css } from "styled-components";

export const ProductListContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;

  h1 {
    font-size: 32px;
    font-weight: bold;
  }
`;

export const Layout = styled.div`
  display: flex;
  margin-top: 50px;
  gap: 20px;
`;

export const FilterSidebar = styled.div`
  width: 300px;
  flex-shrink: 0;

  h3 {
    font-size: 20px;
    margin-top: 0;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }
`;

export const FilterSection = styled.div`
  margin-bottom: 30px;

  h4 {
    font-size: 30px;
    margin-bottom: 20px;
  }

  /* 사이즈/소재 체크박스 스타일 */
  label {
    font-size: 20px;
    color: #333;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    cursor: pointer;
  }

  /* 카테고리 버튼 그룹 스타일 */
  /* .sizes-container나 .material-list가 아닌 일반 div (카테고리 버튼 그룹)에만 flex 적용 */
  div:not(.sizes-container):not(.material-list) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .sizes-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px 10px;
  }

  .sizes-container label {
    margin-bottom: 0;
    display: flex;
  }

  .material-list {
    /* Flex나 Grid를 제거하고 블록으로 설정하여 label이 세로로만 정렬되게 함 */
    display: block;
  }

  /* .material-list 내부의 label은 기본 label 스타일(margin-bottom: 8px)을 따름 */
`;

// FilterButton 스타일 추가 (카테고리 필터용)
export const FilterButton = styled.button`
  padding: 8px 15px;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.$active ? "#000" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#333")};
  cursor: pointer;
  font-size: 14px;
  border-radius: 20px;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;

  &:hover {
    border-color: #000;
  }
`;

export const ProductGrid = styled.div`
  flex-grow: 1;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    span {
      font-size: 14px;
      color: #666;
    }
  }

  .applied-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
    flex-wrap: wrap;

    div {
      background-color: #eee;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;

      button {
        background: none;
        border: none;
        color: #000;
        margin-left: 5px;
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
`;

export const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px 20px;
`;

export const ImageWrapper = styled.div`
  width: 100%;
  padding-top: 100%; /* 1:1 종횡비 (정사각형) 유지 */
  position: relative;
  overflow: hidden;
  margin-bottom: 15px; /* ProductCardComponent의 image-placeholder 대체 */
  background-color: #f5f5f5; /* 실제 이미지가 로드될 때까지의 배경 */

  /* 실제 <img> 태그 스타일 */
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지가 컨테이너를 꽉 채우도록 설정 */
    object-position: center;
  }
`;

// 상품 이름, 카테고리, 가격을 감싸는 래퍼
export const ProductInfoWrapper = styled.div`
  padding: 0 5px; /* 좌우 여백 */

  h4 {
    font-size: 1rem;
    font-weight: 500;
    color: #616161; /* 카테고리/소재 */
    margin: 0;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #212121; /* 이름 */
    margin: 5px 0 5px 0;
  }

  .price {
    font-size: 1rem;
    font-weight: 700;
    color: #212121;
    margin: 0 0 10px 0;
  }

  .original-price {
    color: #9e9e9e; /* gray-500 */
    text-decoration: line-through;
    font-weight: 400;
    margin-right: 8px;
  }

  .sale-price {
    color: #ef4444; /* red-500 */
  }
`;

// SizeItem 스타일 컴포넌트
export const SizeItem = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s;
  user-select: none;

  /* 재고가 있는 경우 */
  ${(props) =>
    props.$isAvailable &&
    css`
      cursor: pointer;
      &:hover {
        border-color: #212121;
        background-color: #f0f0f0;
      }
    `}

  /* 재고가 없는 경우: 빗금 처리 및 비활성화 스타일 */
  ${(props) =>
    !props.$isAvailable &&
    css`
      color: #b0b0b0;
      background-color: #f8f8f8;
      border-color: #f0f0f0;
      position: relative;
      overflow: hidden;
      cursor: not-allowed;

      /* 빗금 (대각선 취소선) 생성 */
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #b0b0b0;
        transform: translateY(-50%) rotate(-45deg); /* 대각선 회전 */
        transform-origin: center center;
      }
    `}
`;

//ProductCard 스타일 (호버 확장 로직)
export const ProductCard = styled.div`
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  padding-bottom: 0;

  /* 호버 시 스타일 변경 */
  ${(props) =>
    props.$isHovered &&
    css`
      z-index: 20;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

      /* .size-overlay의 예상 높이(약 40px) + 상하 여백(10px*2) 만큼 패딩 확장하여 공간 확보 */
      padding-bottom: 60px;

      ${ImageWrapper} img {
        transform: scale(1.05);
      }
    `}

  /* 사이즈 오버레이 스타일 (ProductCard의 하단 확장 영역에 위치) */
  .size-overlay {
    position: absolute;
    top: 100; /* ProductCard의 padding-bottom 시작 지점(확장된 공간의 최하단)에 위치 */
    background: white; /* ProductCard와 동일한 배경색 */
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    /* 기본적으로 숨김 처리 */
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;

    ${(props) =>
      props.$isHovered &&
      css`
        opacity: 1;
        visibility: visible;
      `}
  }

  .size-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
    justify-items: center;
    text-align: center;
  }

  .sale-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #d9534f;
    color: white;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: bold;
  }
`;

export const CollectionMenuContainer = styled.div`
  border-width: 0px;
  border-style: solid;
  border-color: rgb(229, 231, 235);
  border-bottom: 1px solid black;
  box-sizing: border-box;
  overflow-x: scroll;
  scrollbar-width: none; /* Firefox 숨김 */
  width: 100%;

  /* Webkit 계열 (Chrome, Safari) 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

// 기존의 collection-path 역할을 수행하며, 아이템들을 인라인으로 표시
export const CollectionPath = styled.div`
  border-width: 0px;
  border-style: solid;
  border-color: rgb(229, 231, 235);
  box-sizing: border-box;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  margin-bottom: 33px;
`;

// 기존의 path-item 역할을 수행하며, 기본 스타일 적용
export const PathItem = styled.span`
  border-width: 0px;
  border-style: solid;
  border-color: rgb(229, 231, 235);
  box-sizing: border-box;
  border: 1px solid rgb(201, 201, 201);
  border-radius: 3px;
  padding: 12px 20px;
  gap: 10px;
  color: rgb(0, 0, 0);
  background-color: rgb(255, 255, 255);
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 기존의 path-item.active 역할을 수행하며, 활성화 스타일 적용 (Link 사용)
export const PathActiveLink = styled.a`
  border-width: 0px;
  border-style: solid;
  border-color: rgb(229, 231, 235);
  box-sizing: border-box;
  text-decoration: inherit;
  border-radius: 3px;
  padding: 12px 20px;
  gap: 10px;
  color: rgb(0, 0, 0);
  background-color: rgb(255, 255, 255);
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(0, 0, 0);
  margin-right: 16px;
`;

// 기존의 path-children 역할을 수행하며, 자식 링크 그룹화
export const PathChildren = styled.span`
  border-width: 0px;
  border-style: solid;
  border-color: rgb(229, 231, 235);
  box-sizing: border-box;
  gap: 8px;
  display: flex;
  margin-left: 0px;
`;

export const PathChildLink = styled.a`
  border-width: 0px;
  border-style: solid;
  border-color: rgb(229, 231, 235);
  box-sizing: border-box;
  text-decoration: inherit;
  padding: 12px 16px;
  color: rgb(0, 0, 0);
  cursor: pointer; /* 버튼처럼 동작하도록 커서 추가 */
  background: none;
  border: none;

  /* ↓↓↓ 선택 시 활성화 스타일 추가 ↓↓↓ */
  ${(props) =>
    props.$active &&
    `
    font-weight: 700; /* 볼드 처리 */
    border-bottom: 2px solid rgb(0, 0, 0); /* 하단 줄 추가 */
  `}/* ↑↑↑ */
`;

// SVG 스타일링 (Styled Component로 감싸서 사용)
export const CloseIconSVG = styled.svg`
  border-width: 0px;
  border-style: solid;
  border-color: rgb(229, 231, 235);
  box-sizing: border-box;
  display: block;
  vertical-align: middle;
`;

// AppliedFiltersContainer: 전체 필터 목록을 감싸는 컨테이너
export const AppliedFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* 필터가 많아지면 다음 줄로 넘어가도록 설정 */
  gap: 8px; /* 필터 태그 사이의 간격 */
  margin-bottom: 20px;
  padding: 10px 0;
  border-top: 1px solid #eee; /* 필터 섹션과의 구분 */
`;

// FilterTag: 개별 필터 태그 스타일
export const FilterTag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #f0f0f0; /* 배경색으로 태그 형태 강조 */
  border: 1px solid #ddd;
  border-radius: 12px; /* 둥근 모서리로 태그 모양 완성 */
  font-size: 14px;
  color: #333;
  white-space: nowrap; /* 줄바꿈 방지 */
`;

// FilterLabel: 필터 이름 텍스트
export const FilterLabel = styled.span`
  margin-right: 6px;
  font-weight: 500;
`;

// RemoveButton: 제거 버튼 (X) 스타일
export const RemoveButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  color: #777;
  font-size: 16px;
  line-height: 1; /* 높이 맞추기 */
  transition: color 0.2s;

  &:hover {
    color: #000;
  }
`;
``;

export const ClearFiltersButton = styled.button`
  display: inline-block;
  cursor: pointer;
  background-color: transparent;
  color: #555;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px; /* 필터 태그 목록과의 간격 */
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
    color: #000;
    border-color: #aaa;
  }
`;
