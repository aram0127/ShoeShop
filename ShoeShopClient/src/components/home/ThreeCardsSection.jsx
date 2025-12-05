import React from "react";
import {
  SectionWrapper,
  CardsContainer,
  Card,
  CardImage,
  CardText,
} from "./ThreeCardsSection.styled";

const cardData = [
  { url: "/images/final_3_image1.webp", title: "매일 경험하는 편안함", desc: "올버는 마치 구름 위를 걷는 듯한 가벼움과, 바람처럼 자유로운 탄력을 선사합니다. 놀라운 편안함은 긴 여정도 짧은 산책처럼 느껴집니다." },
  { url: "/images/final_3_image2.webp", title: "지속 가능한 발걸음", desc: "소재를 고르는 순간부터 신발이 당신에게 닿는 그 순간까지 지구에 남기는 흔적을 헤아립니다. 탄소 발자국을 제로에 가깝게 줄이려는 노력에 동참해주세요." },
  { url: "/images/final_3_image3.webp", title: "지구에서 온 소재", desc: "올버즈는 가능한 모든 곳에서 석유 기반 합성소재를 천연 대안으로 대체합니다. 울, 나무, 사탕수수 같은 자연 소재는 부드럽고 통기성이 좋습니다." },
];

export default function ThreeCardsSection() {
  return (
    <SectionWrapper>
      <CardsContainer>
        {cardData.map((card, i) => (
          <Card key={i}>
            <CardImage>
              <img src={card.url} alt={card.title} />
            </CardImage>
            <CardText>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </CardText>
          </Card>
        ))}
      </CardsContainer>
    </SectionWrapper>
  );
}
