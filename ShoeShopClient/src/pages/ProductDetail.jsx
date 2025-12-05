import React, { useState } from "react";
import { useParams } from "react-router-dom"; // 라우팅 가정
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
} from "./ProductDetail.styled";
import CartSidebar from "../components/common/CartSidebar"; // 8. 장바구니 현황 표시 컴포넌트 가정

// 7. 아코디언 컴포넌트
const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AccordionItem $isOpen={isOpen}>
      <div className="header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span>{isOpen ? "—" : "+"}</span>
      </div>
      <div className="content">
        <p>{content}</p>
      </div>
    </AccordionItem>
  );
};

const ProductDetail = () => {
  // const { productId } = useParams(); // URL에서 상품 ID를 가져온다고 가정
  const productId = 101; // 테스트를 위해 Mock ID 사용
  const { products, addToCart } = useAppContext();

  const product = products.find((p) => p.id === productId);

  const [selectedSize, setSelectedSize] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false); // 8. 장바구니 현황 표시 상태

  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  const isSale = product.price > product.salePrice;

  // 8. 장바구니 담기 핸들러
  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product, selectedSize, 1);
      // 클릭 시 좌측에 장바구니 현황 자동 표시
      setIsCartVisible(true);
    }
  };

  return (
    <>
      <DetailLayout>
        {/* 7. 이미지 갤러리 (좌측 요소) */}
        <ImageGallery>
          <div className="main-image">{product.name} 메인 이미지</div>
          {/* 다른 서브 이미지들... */}
          <div
            className="main-image"
            style={{ height: "150px", fontSize: "14px" }}
          >
            서브 이미지 1
          </div>
          <div
            className="main-image"
            style={{ height: "150px", fontSize: "14px" }}
          >
            서브 이미지 2
          </div>
        </ImageGallery>

        {/* 7. 상품 정보 및 구매 패널 (우측 스티키 요소) */}
        <InfoPanel>
          <ProductHeader>
            <h1>{product.name}</h1>
            <p>{product.material} 소재</p>
            <div className="price">
              {isSale && (
                <span className="original-price">
                  {product.price.toLocaleString()}원
                </span>
              )}
              <span className={isSale ? "sale-price" : ""}>
                {product.salePrice.toLocaleString()}원
              </span>
            </div>
          </ProductHeader>

          <OptionsSection>
            <h4>사이즈 선택</h4>
            <SizeGrid>
              {product.sizes.map((size) => (
                <SizeButton
                  key={size}
                  $isSelected={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </SizeButton>
              ))}
            </SizeGrid>
            {/* 8. 사이즈 선택 시 '장바구니 담기' 버튼 표시 */}
            <AddToCartButton onClick={handleAddToCart} disabled={!selectedSize}>
              {selectedSize
                ? `${selectedSize}mm 장바구니에 담기`
                : "사이즈를 선택하세요"}
            </AddToCartButton>
          </OptionsSection>

          {/* 7. 아코디언 UI 구현 (내용 고정) */}
          <Accordion
            title="제품 상세 정보"
            content="이 신발은 100% 지속 가능한 울과 스위트 폼으로 만들어졌습니다. 매우 가볍고 통기성이 뛰어나 일상생활에 완벽합니다. 세탁기 사용 가능."
          />
          <Accordion
            title="배송 및 반품"
            content="일반 배송은 3~5일 소요됩니다. 30일 이내 무료 반품 및 교환이 가능합니다."
          />
          <Accordion title={`리뷰 (0)`} content="리뷰는 하단에 표시됩니다." />
          {/* 리뷰 섹션은 실제로는 별도의 컴포넌트로 구현되어야 합니다. */}
        </InfoPanel>
      </DetailLayout>

      {/* 8. 장바구니 현황 Sidebar (좌측에 표시) */}
      <CartSidebar
        isVisible={isCartVisible}
        onClose={() => setIsCartVisible(false)}
      />
    </>
  );
};

export default ProductDetail;
