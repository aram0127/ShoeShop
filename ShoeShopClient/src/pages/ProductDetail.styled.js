import styled, { css } from 'styled-components';

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
  
  h1 { font-size: 32px; margin: 0 0 10px 0; }
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
  h4 { font-size: 16px; margin-bottom: 10px; }
`;

export const SizeGrid = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const SizeButton = styled.button`
  padding: 10px 15px;
  border: 1px solid #ccc;
  background-color: ${props => props.$isSelected ? '#000' : '#fff'};
  color: ${props => props.$isSelected ? '#fff' : '#333'};
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
    max-height: ${props => props.$isOpen ? '200px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    padding-bottom: ${props => props.$isOpen ? '15px' : '0'};
    
    p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
  }
`;