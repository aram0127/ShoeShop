import React from "react";
import { useAppContext } from "../context/App.context";
import styled from "styled-components";

const MyPageContainer = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
`;

const OrderCard = styled.div`
  border: 1px solid #ddd;
  margin-bottom: 20px;
  padding: 20px;

  h3 {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 15px;
    font-size: 20px;
  }
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px dashed #eee;

  .details {
    flex-grow: 1;
  }
  .review-status {
    font-size: 14px;
    color: ${(props) => (props.$isReviewed ? "green" : "blue")};
    cursor: pointer;
  }
`;

const MyPage = () => {
  const { orders } = useAppContext();

  return (
    <MyPageContainer>
      <h2>마이페이지 - 지난 주문 내역</h2>

      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order.orderId}>
            <h3>
              주문 번호: {order.orderId} (주문일: {order.date})
            </h3>

            {/* 주문 내역을 제품별로 표시 */}
            {order.products.map((product) => (
              <ProductItem
                key={`${order.orderId}-${product.productId}-${product.size}`}
                $isReviewed={product.isReviewed}
              >
                <div className="details">
                  <h4>{product.name}</h4>
                  <p>
                    사이즈: {product.size}mm / 수량: {product.quantity}개
                  </p>
                  <p>총 금액: {product.price.toLocaleString()}원</p>
                </div>
                {/* 구매 완료 제품에 대해 리뷰 작성 가능해야 함 */}
                <div
                  className="review-status"
                  onClick={() =>
                    !product.isReviewed &&
                    alert(
                      `리뷰 작성 페이지로 이동: 상품 ID ${product.productId}`
                    )
                  }
                >
                  {product.isReviewed ? "리뷰 작성 완료" : "리뷰 작성 가능"}
                </div>
              </ProductItem>
            ))}
          </OrderCard>
        ))
      )}
    </MyPageContainer>
  );
};

export default MyPage;
