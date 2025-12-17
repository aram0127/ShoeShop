import React, { useState } from "react";
import styled from "styled-components";
import { useAppContext } from "../context/App.context";
import ReviewForm from "../components/product/ReviewForm";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: bold;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const OrderCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const OrderHeader = styled.div`
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .order-info {
    display: flex;
    gap: 20px;
    font-size: 14px;
    color: #555;

    span {
      strong {
        color: #333;
        margin-right: 5px;
      }
    }
  }

  .order-detail-link {
    font-size: 14px;
    color: #333;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const OrderItem = styled.div`
  padding: 20px;
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    background-color: #f5f5f5;
  }

  .item-info {
    flex-grow: 1;

    h4 {
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #777;
      line-height: 1.5;
    }
  }

  .item-status {
    text-align: right;
    min-width: 120px;

    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      background-color: #e9ecef;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #495057;
      margin-bottom: 8px;
    }

    button {
      display: block;
      width: 100%;
      padding: 5px 0;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        background-color: #f8f9fa;
      }
    }
  }
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 50px;
  color: #888;
  font-size: 16px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #555;
  }
`;

const MyPage = () => {
  const { user, orders, addReview } = useAppContext();

  // 모달 상태 관리
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  if (!user) {
    return (
      <Container>
        <NoOrders>로그인이 필요한 페이지입니다.</NoOrders>
      </Container>
    );
  }

  // 모달 열기 핸들러
  const handleReviewClick = (productId) => {
    setSelectedProductId(productId);
    setIsReviewModalOpen(true);
  };

  // 모달 닫기 핸들러
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <Container>
      <h2
        style={{ fontSize: "28px", marginBottom: "30px", fontWeight: "bold" }}
      >
        마이 페이지 - 주문 내역
      </h2>

      {orders.length === 0 ? (
        <NoOrders>아직 주문 내역이 없습니다.</NoOrders>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {orders.map((order) => (
            <OrderCard key={order._id}>
              <OrderHeader>
                <div className="order-info">
                  <span>
                    <strong>주문일자</strong>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    <strong>총 결제금액</strong>{" "}
                    {order.totalAmount.toLocaleString()}원
                  </span>
                </div>
              </OrderHeader>
              {order.items.map((item, idx) => (
                <OrderItem key={`${order._id}-${idx}`}>
                  <img
                    src={`http://localhost:3000/${item.image}`}
                    alt={item.name}
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>
                      사이즈: {item.size} | 수량: {item.quantity}
                    </p>
                    <p>{item.priceAtPurchase.toLocaleString()}원</p>
                  </div>
                  <div className="item-status">
                    {!item.isReviewed ? (
                      <button onClick={() => handleReviewClick(item.product)}>
                        후기 작성
                      </button>
                    ) : (
                      <button
                        disabled
                        style={{
                          color: "#aaa",
                          borderColor: "#eee",
                          cursor: "default",
                        }}
                      >
                        작성 완료
                      </button>
                    )}
                  </div>
                </OrderItem>
              ))}
            </OrderCard>
          ))}
        </div>
      )}

      {/* 후기 작성 모달 */}
      {isReviewModalOpen && (
        <ModalOverlay onClick={closeReviewModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeReviewModal}>
              &times;
            </button>
            <ReviewForm
              productId={selectedProductId}
              onReviewSubmitted={closeReviewModal}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default MyPage;
