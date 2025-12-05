import React from "react";
import { useAppContext } from "../../context/App.context";
import styled, { css } from "styled-components";

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 350px;
  background-color: #fff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  transform: translateX(${(props) => (props.$isVisible ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;
  z-index: 200;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const CartItem = styled.div`
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;

  .info {
    flex-grow: 1;
  }
  h4 {
    margin: 0 0 5px 0;
    font-size: 16px;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #666;
  }
`;

const CheckoutButton = styled.button`
  padding: 15px;
  background-color: #388e3c;
  color: white;
  border: none;
  font-size: 16px;
  margin-top: auto; /* 하단에 고정 */
  cursor: pointer;

  &:disabled {
    background-color: #aaa;
  }
`;

const CartSidebar = ({ isVisible, onClose }) => {
  const { cart, checkout } = useAppContext();

  const handleCheckout = () => {
    // 9. 결제 버튼 클릭 시 장바구니 비우고 주문 내역 추가
    if (checkout()) {
      alert("결제가 완료되었습니다. 주문 내역을 마이페이지에서 확인하세요.");
      onClose();
    }
  };

  return (
    <Sidebar $isVisible={isVisible}>
      <h3>장바구니 현황 ({cart.length})</h3>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          right: "10px",
          top: "10px",
          background: "none",
          border: "none",
          fontSize: "20px",
        }}
      >
        X
      </button>

      <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: "20px" }}>
        {cart.length === 0 ? (
          <p>장바구니가 비어 있습니다.</p>
        ) : (
          cart.map((item, index) => (
            <CartItem key={index}>
              <div className="info">
                <h4>{item.product.name}</h4>
                <p>
                  사이즈: {item.size}mm / 수량: {item.quantity}
                </p>
                <p>
                  가격:{" "}
                  {(item.product.salePrice * item.quantity).toLocaleString()}원
                </p>
              </div>
            </CartItem>
          ))
        )}
      </div>

      <CheckoutButton onClick={handleCheckout} disabled={cart.length === 0}>
        결제하기
      </CheckoutButton>
    </Sidebar>
  );
};

export default CartSidebar;
