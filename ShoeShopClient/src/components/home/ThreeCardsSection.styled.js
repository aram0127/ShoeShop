import styled from "styled-components";

export const SectionWrapper = styled.div`

  padding: 50px 0;
`;

export const CardsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between; /* 카드 사이 간격 */
  gap: 20px;
`;

export const Card = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;

`;

export const CardImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const CardText = styled.div`
  padding: 20px;

  h3 {
    font-size: 18px;
    margin-bottom: 6px;
    font-weight: 700;
    color: #222;
  }

  p {
    font-size: 16px;
    color: #555;
    line-height: 1.5;
  }
`;
