import React from "react";
import { useAppContext } from "../../context/App.context";
import styled from "styled-components";

// 오버레이 스타일 (기존 유지)
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  visibility: ${(props) => (props.$isVisible ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 400px; /* 너비를 조금 더 넓힘 */
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  transform: translateX(${(props) => (props.$isVisible ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  z-index: 2000;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    margin: 0;
  }
  button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
`;

const CartList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
`;

const CartItem = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;

  /* 이미지 영역 */
  .image-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f9f9f9;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  /* 정보 영역 */
  .info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h4 {
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .meta {
      font-size: 13px;
      color: #777;
      margin-bottom: 8px;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;

  button {
    background: none;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      background-color: #f5f5f5;
    }
  }
  span {
    padding: 0 5px;
    font-size: 14px;
    min-width: 20px;
    text-align: center;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #999;
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: #ff4d4f;
  }
`;

const Footer = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
  background-color: #fff;

  .total {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #212121;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background-color: #424242;
  }
`;

const CartSidebar = ({ isVisible, onClose }) => {
  const { cart, checkout, updateQuantity, removeFromCart } = useAppContext();

  // 총액 계산
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (await checkout()) {
      alert("결제가 완료되었습니다.");
      onClose();
    }
  };

  return (
    <>
      <Overlay $isVisible={isVisible} onClick={onClose} />
      <Sidebar $isVisible={isVisible}>
        <SidebarHeader>
          <h2>장바구니</h2>
          <button onClick={onClose}>&times;</button>
        </SidebarHeader>

        <CartList>
          {cart.length === 0 ? (
            <div
              style={{ textAlign: "center", marginTop: "50px", color: "#888" }}
            >
              장바구니가 비어있습니다.
            </div>
          ) : (
            cart.map((item, index) => (
              <CartItem key={`${item.productId}-${item.size}-${index}`}>
                <div className="image-wrapper">
                  {/* 이미지 경로 연결 */}
                  <img
                    src={`http://localhost:3000/${item.image}`}
                    alt={item.name}
                  />
                </div>
                <div className="info">
                  <div>
                    <h4>{item.name}</h4>
                    <div className="meta">
                      사이즈: {item.size} | 개별가격:{" "}
                      {item.price.toLocaleString()}원
                    </div>
                  </div>

                  <div className="controls">
                    <QuantityControl>
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1
                              )
                            : null
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </QuantityControl>

                    <div style={{ fontWeight: "bold" }}>
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>
                  </div>
                  <div style={{ textAlign: "right", marginTop: "5px" }}>
                    <DeleteButton
                      onClick={() => removeFromCart(item.productId, item.size)}
                    >
                      삭제
                    </DeleteButton>
                  </div>
                </div>
              </CartItem>
            ))
          )}
        </CartList>

        <Footer>
          <div className="total">
            <span>총 결제 금액</span>
            <span>{totalAmount.toLocaleString()}원</span>
          </div>
          <CheckoutButton onClick={handleCheckout} disabled={cart.length === 0}>
            결제하기
          </CheckoutButton>
        </Footer>
      </Sidebar>
    </>
  );
};

export default CartSidebar;
