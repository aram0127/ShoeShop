import React from "react";
import styled from "styled-components";
import { useAppContext } from "../context/App.context";

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

const MyPage = () => {
  const { user, orders, addReview } = useAppContext();

  if (!user) {
    return (
      <Container>
        <NoOrders>로그인이 필요한 페이지입니다.</NoOrders>
      </Container>
    );
  }

  const handleReviewClick = (productId) => {
    // 간단한 예시로 window.prompt 사용.
    // 실제로는 모달(Modal) UI 등을 구현하여 연동하는 것이 좋습니다.
    const rating = prompt("평점(1~5)을 입력해주세요:", "5");
    if (rating === null) return;

    const content = prompt("리뷰 내용을 입력해주세요:");
    if (content) {
      addReview(productId, parseInt(rating), content);
      alert("리뷰가 등록되었습니다.");
    }
  };

  return (
    <Container>
      <Title>마이 페이지 - 주문 내역</Title>

      {orders.length === 0 ? (
        <NoOrders>아직 주문 내역이 없습니다.</NoOrders>
      ) : (
        <OrderList>
          {orders.map((order) => (
            <OrderCard key={order._id}>
              {" "}
              {/* 서버 ID인 _id 사용 */}
              <OrderHeader>
                <div className="order-info">
                  <span>
                    <strong>주문일자</strong>
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {/* createdAt 사용 */}
                  </span>

                  <span>
                    <strong>총 결제금액</strong>{" "}
                    {order.totalAmount.toLocaleString()}원
                  </span>
                </div>
              </OrderHeader>
              {/* products가 아니라 items 배열을 순회해야 함 */}
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
                    {!item.isReviewed && (
                      <button
                        onClick={() => handleReviewClick(item.product)} // item.product가 상품 ID임
                      >
                        후기 작성
                      </button>
                    )}
                    {item.isReviewed && (
                      <button
                        disabled
                        style={{ color: "#aaa", borderColor: "#eee" }}
                      >
                        작성 완료
                      </button>
                    )}
                  </div>
                </OrderItem>
              ))}
            </OrderCard>
          ))}
        </OrderList>
      )}
    </Container>
  );
};

export default MyPage;
