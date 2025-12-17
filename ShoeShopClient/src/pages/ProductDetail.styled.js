import styled, { css } from "styled-components";

export const DetailLayout = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  display: flex;
  gap: 50px;
`;

export const ImageGallery = styled.div`
  flex: 1;
  img {
    width: 100%;
    height: auto;
    border: 1px solid #eee;
  }
`;

export const InfoPanel = styled.div`
  flex: 1;
`;

export const ProductHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;

  h1 {
    font-size: 32px;
    margin: 0 0 10px 0;
  }
  .price-info {
    font-size: 24px;
    font-weight: bold;
    color: #333;

    .original-price {
      font-size: 16px;
      color: #999;
      text-decoration: line-through;
      margin-right: 10px;
      font-weight: normal;
    }
    .sale-price {
      color: #d9534f; /* 세일 가격 강조 */
    }
  }
`;

export const OptionsSection = styled.div`
  margin-bottom: 30px;
  h4 {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

export const SizeGrid = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const SizeButton = styled.button`
  padding: 10px 15px;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.$isSelected ? "#000" : "#fff")};
  color: ${(props) => (props.$isSelected ? "#fff" : "#333")};
  cursor: pointer;
  font-size: 14px;
  min-width: 50px;

  &:hover {
    border-color: #000;
  }
`;

export const AddToCartButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #388e3c;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

export const AccordionItem = styled.div`
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;

  .header {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    font-weight: bold;
    cursor: pointer;
  }

  .content {
    max-height: ${(props) => (props.$isOpen ? "200px" : "0")};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    padding-bottom: ${(props) => (props.$isOpen ? "15px" : "0")};

    p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
  }
`;

export const ReviewSection = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
  border-top: 1px solid #e1e1e1; /* 상단 구분선 */
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; /* 깔끔한 산세리프 폰트 */
`;

export const ReviewHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h3 {
    font-size: 28px;
    font-weight: 700;
    color: #212a2f;
    letter-spacing: 0.5px;
  }
`;

export const ReviewSummary = styled.div`
  background-color: #f8f8f8; /* 아주 연한 회색 배경 */
  padding: 40px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  text-align: center;
`;

export const SummaryLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const AverageScore = styled.div`
  font-size: 64px;
  font-weight: 700;
  color: #212a2f;
  line-height: 1;
`;

export const StarRow = styled.div`
  color: #212a2f; /* Allbirds는 별 색이 검정 혹은 짙은 회색인 경우가 많음 (노란색 원하면 #f5a623) */
  letter-spacing: 2px;

  &.large {
    font-size: 24px;
  }
`;

export const TotalReviews = styled.div`
  font-size: 14px;
  color: #555;
  margin-top: 5px;
`;

/* 후기 리스트 */
export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0; /* 아이템 간 간격 0 (border로 구분) */
`;

export const ReviewItem = styled.div`
  padding: 30px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &:first-child {
    border-top: 1px solid #eee;
  }

  .review-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const ReviewStars = styled.div`
  color: #212a2f;
  font-size: 14px;
  letter-spacing: 1px;
`;

export const ReviewDate = styled.div`
  font-size: 13px;
  color: #767676;
`;

export const ReviewBody = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #212a2f;
  margin: 0;
  white-space: pre-line;
`;

export const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #555;
  margin-top: 5px;

  .name {
    font-weight: 600;
    margin-right: 10px;
  }

  .verified {
    color: #999;
    font-weight: 400;

    &::before {
      content: "✓";
      margin-right: 4px;
      color: #212a2f;
    }
  }
`;
