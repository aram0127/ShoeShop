import React, { useState } from "react";
import styled from "styled-components";
import { useAppContext } from "../../context/App.context";

// --- Styled Components 정의 ---

const FormContainer = styled.div`
  /* 모달 내부 콘텐츠 컨테이너 */
  display: flex;
  flex-direction: column;
  gap: 20px; /* 요소 간 간격 통일 */
  color: #333;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: #222;
`;

const StarRatingContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  font-size: 32px; /* 별 크기 키움 */
`;

// 별 개별 컴포넌트 (props를 제대로 받기 위해 분리)
const StyledStar = styled.span`
  cursor: pointer;
  /* $filled props에 따라 색상 변경 (금색 / 회색) */
  color: ${(props) => (props.$filled ? "#FFD700" : "#E0E0E0")};
  transition: color 0.2s ease-in-out, transform 0.1s;

  &:hover {
    transform: scale(1.1); /* 마우스 오버 시 약간 커짐 */
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #388e3c; /* 포커스 시 초록색 테두리 */
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical; /* 세로 크기 조절만 허용 */
  min-height: 100px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #388e3c;
  }
`;

const SubmitButton = styled.button`
  padding: 15px;
  background-color: #388e3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2e7d32;
  }

  /* 입력이 부족할 때 버튼 비활성화 스타일 */
  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

// --- 컴포넌트 로직 ---

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { addReview } = useAppContext();

  // 유효성 검사: 모든 필드가 입력되었는지 확인
  const isFormValid =
    rating > 0 && title.trim() !== "" && content.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await addReview(productId, rating, title, content);
      alert("후기가 성공적으로 등록되었습니다!");

      // 폼 초기화
      setTitle("");
      setContent("");
      setRating(5);
      // 모달 닫기 콜백 실행
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      // 에러는 Context에서 처리됨 (alert 표시)
    }
  };

  return (
    <FormContainer>
      <Title>상품 후기 작성</Title>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* 별점 선택 영역 */}
        <div>
          <Label
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            별점을 선택해주세요
          </Label>
          <StarRatingContainer>
            {[1, 2, 3, 4, 5].map((star) => (
              <StyledStar
                key={star}
                $filled={star <= rating} // 현재 점수보다 작거나 같으면 채워진 스타일 적용
                onClick={() => setRating(star)}
              >
                ★
              </StyledStar>
            ))}
          </StarRatingContainer>
        </div>

        {/* 제목 입력 영역 */}
        <InputGroup>
          <Label htmlFor="review-title">제목</Label>
          <Input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="후기 제목을 입력해주세요"
            maxLength={50}
          />
        </InputGroup>

        {/* 내용 입력 영역 */}
        <InputGroup>
          <Label htmlFor="review-content">내용</Label>
          <TextArea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상품에 대한 후기를 남겨주세요."
            rows="5"
            minLength={1}
          />
        </InputGroup>

        {/* 제출 버튼 */}
        <SubmitButton type="submit" disabled={!isFormValid}>
          후기 등록하기
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default ReviewForm;
