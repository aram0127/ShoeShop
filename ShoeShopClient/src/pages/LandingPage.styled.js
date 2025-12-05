import styled from 'styled-components';

export const LandingPageMain = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;


export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
`;

export const GridItem = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  background-color: #fff;
  
  img {
    width: 100%;
    height: auto;
    margin-bottom: 15px;
  }
  
  h4 {
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  p {
    font-size: 14px;
    color: #666;
  }
`;

