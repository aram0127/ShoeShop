import React, { useState } from "react";
import styled from "styled-components";
import { useAppContext } from "../../context/App.context"; // Context 사용

const FormContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;

  h4 {
    margin-top: 0;
    font-size: 18px;
  }
`;

const StarRating = styled.div`
  margin-bottom: 15px;
  font-size: 24px;

  span {
    cursor: pointer;
    color: ${(props) => (props.$filled ? "gold" : "#ccc")};
  }
`;

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const { addReview } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !content.trim()) {
      alert("별점과 내용을 모두 입력해 주세요.");
      return;
    }

    addReview(productId, rating, content); // Context 함수 호출 (10번 요구사항)
    alert("리뷰가 성공적으로 등록되었습니다!");
    onReviewSubmitted(); // 폼 닫기
  };

  return (
    <FormContainer>
      <h4>리뷰 작성</h4>
      <form onSubmit={handleSubmit}>
        <StarRating>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              $filled={star <= rating}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </StarRating>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="솔직한 리뷰를 남겨주세요."
          rows="4"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#388e3c",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          리뷰 등록
        </button>
      </form>
    </FormContainer>
  );
};

export default ReviewForm;
