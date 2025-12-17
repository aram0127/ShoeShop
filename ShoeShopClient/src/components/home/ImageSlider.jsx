import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MainImage,
  SliderWrapper,
  SliderContainer,
  SlideCard,
  Button,
  ImageBox,
  InfoBox,
  SectionTitle,
  BigCardContainer,
  BigCard,
  BigCardImage,
  BigCardInfo,
  Newsletter,
  MainImageButtons,
  MainImageButton,
} from "./ImageSlider.styled";
import { images, bigCards, VISIBLE } from "./ImageSlider.data";

export default function ImageSlider() {
  const [index, setIndex] = useState(0);
  const maxIndex = images.length - VISIBLE;
  const navigate = useNavigate();

  const nextSlide = () => {
    if (index < maxIndex) setIndex(index + 1);
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleClick = () => {
    navigate(`/products`);
  };

  return (
    <>
      <MainImage>
        <img src="/images/main_image.webp" alt="메인 이미지" />
        <MainImageButtons>
          <MainImageButton onClick={() => handleClick()}>
            남성 세일
          </MainImageButton>
          <MainImageButton onClick={() => handleClick()}>
            여성 세일
          </MainImageButton>
        </MainImageButtons>
      </MainImage>

      <SliderWrapper>
        <Button onClick={prevSlide} disabled={index === 0}>
          〈
        </Button>
        <SliderContainer translate={index}>
          {images.map((item, i) => (
            <SlideCard key={i}>
              <ImageBox>
                <img src={item.url} alt={item.name} />
              </ImageBox>
              <InfoBox>
                <p className="name">{item.name}</p>
                <p className="price">{item.price}</p>
              </InfoBox>
            </SlideCard>
          ))}
        </SliderContainer>
        <Button onClick={nextSlide} disabled={index === maxIndex}>
          〉
        </Button>
      </SliderWrapper>

      <SectionTitle>우리가 사용하는 소재</SectionTitle>

      <BigCardContainer>
        {bigCards.map((card, i) => (
          <BigCard key={i}>
            <BigCardImage>
              <img src={card.url} alt={card.title} />
            </BigCardImage>
            <BigCardInfo>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <button className="learn-more">더 알아보기</button>
            </BigCardInfo>
          </BigCard>
        ))}
      </BigCardContainer>

      <Newsletter>
        <h3>올버즈 뉴스레터 구독</h3>
        <p>최신 신제품 소식과 혜택을 가장 먼저 받아보세요.</p>
        <div className="input-area">
          <input type="email" placeholder="Email" />
          <button>구독</button>
        </div>
      </Newsletter>
    </>
  );
}
