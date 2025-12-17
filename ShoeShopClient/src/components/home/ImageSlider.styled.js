import styled from "styled-components";

export const MainImage = styled.div`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto 30px auto;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    height: 900px;
    object-fit: cover;
    display: block;
  }
`;

export const MainImageButtons = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 20px;
  z-index: 10;
`;

export const MainImageButton = styled.button`
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  background-color: rgba(27, 26, 26, 0.85);
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: rgba(102, 101, 101, 1);
  }
`;

export const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  padding: 20px 0;
  color:black;
`;

export const SliderContainer = styled.div`
  display: flex;
  gap: 10px;
  transition: transform 0.35s ease-in-out;
  transform: ${(props) => `translateX(-${props.translate * 20}%)`};
`;

export const SlideCard = styled.div`
  flex: 0 0 calc(20% - 8px);
  background: #ffffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: #efefefff;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const InfoBox = styled.div`
  padding: 10px;
  text-align: center;

  .name {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .price {
    font-size: 14px;
    color: #555;
  }
`;

export const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  &:first-of-type {
    left: 5px;
  }

  &:last-of-type {
    right: 5px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  text-align: left;
  max-width: 500px;
  margin: 50px 1030px 30px auto; 
  color: #222;
`;

export const BigCardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 60px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

export const BigCard = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

export const BigCardImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const BigCardInfo = styled.div`
  padding: 20px;

  h3 {
    font-size: 16px;
    margin-bottom: 0;
    font-weight: 600;
    color: #222;
    
  }

  p {
    font-size: 23px;
    color: #555;
    line-height: 1.5;
    margin-bottom: 40px;
  }

  .learn-more {
    display: inline-block;
    padding: 16px 30px;
    font-size: 16px;
    background-color: transparent;
    color: #000;
    border: 1px solid #000;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.2s, color 0.2s;

    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
`;

export const Newsletter = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  h3 {
    font-size: 50px;
    margin-bottom: 0;
    color:black;
  }

  p {
    font-size: 14px;
    margin-bottom: 50px;
    color: #000000ff;
  }

  div {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  input {
    padding: 22px 10px;
    border: 1px solid #ccc;
    width: 350px;
    border-radius: 6px;
    font-size: 14px;
    background-color: #fff;
  }

  button {
    padding: 16px 20px;
    font-size: 14px;
    background-color: #020602ff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
`;
