import React, { createContext, useContext, useState } from "react";
import { mockProducts, mockOrders } from "../mockData";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [cart, setCart] = useState([]);

  // 장바구니에 상품 추가 (8번 요구사항)
  const addToCart = (product, size) => {
    const itemInCart = cart.find(
      (item) => item.productId === product.id && item.size === size
    );
    if (itemInCart) {
      setCart(
        cart.map((item) =>
          item.productId === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 } // 수량만 증가시키고, 가격은 ProductDetail에서 전달받은 price로 업데이트 필요 (이 코드는 단순화)
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: Date.now(), // 고유 ID
          productId: product.id,
          name: product.name,
          size: size,
          quantity: 1,
          price: product.salePrice, // 할인 적용된 가격
          photo: product.photo,
        },
      ]);
    }
  };

  // 결제 및 주문 내역 추가 (9번 요구사항)
  const checkout = () => {
    if (cart.length === 0) return false;

    const newOrder = {
      id: orders.length + 1,
      date: new Date().toISOString(),
      totalAmount: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      products: cart.map((item) => ({
        ...item,
        status: "배송 준비 중",
        isReviewed: false, // 10. 후기 상태 초기화
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);

    return true;
  };

  // 리뷰 추가 (10번 요구사항)
  const addReview = (productId, rating, content) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => ({
        ...order,
        products: order.products.map((product) =>
          product.productId === productId && !product.isReviewed
            ? {
                ...product,
                isReviewed: true,
                review: { rating, content, date: new Date().toISOString() },
              }
            : product
        ),
      }))
    );
  };

  const contextValue = {
    products,
    orders,
    cart,
    addToCart,
    checkout,
    addReview,
    setProducts,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
