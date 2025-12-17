import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/App.context";
import {
  DetailLayout,
  ImageGallery,
  InfoPanel,
  ProductHeader,
  OptionsSection,
  SizeGrid,
  SizeButton,
  AddToCartButton,
  AccordionItem,
  ReviewSection,
  ReviewHeader,
  ReviewSummary,
  SummaryLeft,
  AverageScore,
  StarRow,
  TotalReviews,
  ReviewList,
  ReviewItem,
  ReviewerInfo,
  ReviewDate,
  ReviewBody,
  ReviewStars,
} from "./ProductDetail.styled";
import CartSidebar from "../components/common/CartSidebar";

// 아코디언 컴포넌트
const Accordion = ({ title, content, children, isOpen, onToggle }) => {
  return (
    // isOpen과 onToggle을 props로 받아서 사용
    <AccordionItem $isOpen={isOpen}>
      <div className="header" onClick={onToggle}>
        {title}
        <span>{isOpen ? "—" : "+"}</span>
      </div>
      <div className="content">{children ? children : <p>{content}</p>}</div>
    </AccordionItem>
  );
};

const ProductDetail = () => {
  const { productId } = useParams();
  const { addToCart } = useAppContext();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

  const handleAccordionToggle = (index) => {
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const productRes = await axios.get(
          `http://localhost:3000/api/products/${productId}`
        );
        setProduct(productRes.data);

        if (productRes.data.images && productRes.data.images.length > 0) {
          setMainImage(`http://localhost:3000/${productRes.data.images[0]}`);
        }

        const reviewRes = await axios.get(
          `http://localhost:3000/api/reviews/${productId}`
        );
        setReviews(reviewRes.data);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        alert("상품 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        상품 정보를 불러오는 중입니다...
      </div>
    );
  if (!product)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        상품을 찾을 수 없습니다.
      </div>
    );

  const discountRate = product.discountRate || 0;
  const isSale = discountRate > 0;
  const finalPrice =
    product.finalPrice || Math.round(product.price * (1 - discountRate / 100));

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(
        {
          ...product,
          id: product._id,
          salePrice: finalPrice,
          photo: product.images[0],
        },
        selectedSize,
        1
      );

      setIsCartVisible(true);
    } else {
      alert("사이즈를 선택해주세요.");
    }
  };

  // 별점 렌더링 헬퍼 함수
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // 평균 평점 계산
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <>
      <DetailLayout>
        <ImageGallery>
          <div className="main-image">
            <img
              src={mainImage}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* [위치 변경] 아코디언 섹션을 InfoPanel에서 여기(ImageGallery 하단)로 이동 */}
          <div style={{ marginTop: "40px" }}>
            <Accordion
              title="제품 상세 정보"
              content={"제조국: 베트남"}
              isOpen={openAccordionIndex === 0}
              onToggle={() => handleAccordionToggle(0)}
            />
            <Accordion
              title="지속 가능성"
              content="탄소 발자국 표시와 탄소 배출량 저감을 위한 노력을 통해 올버즈는 Climate Neutral에서 탄소 중립 기업 인증을 획득했으며, 탄소 저감 프로젝트 펀딩을 비롯한 지속 가능한 활동을 통해 탄소 중립을 실현합니다."
              isOpen={openAccordionIndex === 1}
              onToggle={() => handleAccordionToggle(1)}
            />
            <Accordion
              title="세탁 방법 및 취급시 주의사항"
              content="건조기 사용은 피해주세요. 세탁 후에 원래 모양으로 곧 돌아오니 걱정 마세요. 신발 끈과 인솔은 손세탁 하셔도 됩니다."
              isOpen={openAccordionIndex === 2}
              onToggle={() => handleAccordionToggle(2)}
            />
            <Accordion
              title="배송 & 반품"
              content="전제품 5만원 이상 구입 시 무료 배송"
              isOpen={openAccordionIndex === 3}
              onToggle={() => handleAccordionToggle(3)}
            />
          </div>
        </ImageGallery>

        <InfoPanel>
          <ProductHeader>
            <h1>{product.name}</h1>
            <div className="price">
              {isSale && (
                <span className="original-price">
                  ₩{product.price.toLocaleString()}
                </span>
              )}
              <span className={isSale ? "sale-price" : ""}>
                {/* 원가 표시 방식 수정: 공백 대신 조건부 렌더링 유지 */}
                {isSale
                  ? ` => ₩${finalPrice.toLocaleString()}`
                  : `₩${finalPrice.toLocaleString()}`}
              </span>
            </div>
            {isSale && (
              <p
                style={{
                  color: "#e53935",
                  fontSize: "0.9rem",
                  marginTop: "5px",
                }}
              >
                {discountRate}% 할인
              </p>
            )}
            <p>{product.description}</p>
          </ProductHeader>

          <OptionsSection>
            {/* 서브 이미지 리스트 */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                flexWrap: "wrap",
              }}
            >
              {product.images &&
                product.images.map((img, index) => (
                  <div
                    key={index}
                    className="sub-image"
                    style={{
                      width: "80px",
                      height: "80px",
                      cursor: "pointer",
                      border:
                        mainImage === `http://localhost:3000/${img}`
                          ? "2px solid #000"
                          : "1px solid #ddd",
                    }}
                    onClick={() => setMainImage(`http://localhost:3000/${img}`)}
                  >
                    <img
                      src={`http://localhost:3000/${img}`}
                      alt={`sub-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
            </div>
            <h4>사이즈 선택</h4>
            <SizeGrid>
              {product.availableSizes &&
                product.availableSizes.map((size) => (
                  <SizeButton
                    key={size}
                    $isSelected={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </SizeButton>
                ))}
            </SizeGrid>

            <AddToCartButton onClick={handleAddToCart} disabled={!selectedSize}>
              {selectedSize
                ? `장바구니에 담기 - ${finalPrice.toLocaleString()}원`
                : "사이즈를 선택하세요"}
            </AddToCartButton>
          </OptionsSection>
        </InfoPanel>
      </DetailLayout>

      <ReviewSection>
        {reviews.length > 0 ? (
          <>
            {/* 1. 평점 요약 섹션 */}
            <ReviewSummary>
              <SummaryLeft>
                <AverageScore>{averageRating}</AverageScore>
                <StarRow className="large">
                  {renderStars(averageRating)}
                </StarRow>
                <TotalReviews>
                  {reviews.length}건의 리뷰 분석 결과입니다.
                </TotalReviews>
              </SummaryLeft>
              {/* 필요하다면 여기에 '평점 분포 바(Bar)' 추가 가능 */}
            </ReviewSummary>

            {/* 2. 후기 리스트 섹션 */}
            <ReviewList>
              {reviews.map((review) => (
                <ReviewItem key={review._id}>
                  <ReviewerInfo>
                    <span className="name">
                      {review.userName || "Shoe Lover"}
                    </span>
                  </ReviewerInfo>
                  <div className="review-top">
                    <ReviewStars>
                      {renderStars(review.rating)}&nbsp;
                      <span>
                        <strong>{review.title}</strong>
                      </span>
                    </ReviewStars>
                    <ReviewDate>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </ReviewDate>
                  </div>

                  {/* 제목이 데이터에 없다면 본문 첫줄이나 생략 */}
                  <ReviewBody>{review.content}</ReviewBody>
                </ReviewItem>
              ))}
            </ReviewList>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            아직 후기가 없습니다.
          </div>
        )}
      </ReviewSection>

      <CartSidebar
        isVisible={isCartVisible}
        onClose={() => setIsCartVisible(false)}
      />
    </>
  );
};

export default ProductDetail;
