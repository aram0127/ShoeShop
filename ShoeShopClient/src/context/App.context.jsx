import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { mockProducts, mockOrders } from "../mockData";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [cart, setCart] = useState([]);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 장바구니 불러오기 함수
  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/cart", {
        withCredentials: true,
      });
      setCart(response.data);
    } catch (err) {
      console.error("장바구니 불러오기 실패", err);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/check",
          {
            withCredentials: true,
          }
        );
        if (response.data.isLoggedIn) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error("세션 확인 실패", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
    fetchCart(); // 앱 로드 시 장바구니 동기화
  }, []);

  const login = (userData) => {
    setUser(userData);
    fetchCart(); // 로그인 시 장바구니 다시 불러오기
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setCart([]);
      setUser(null);
      alert("로그아웃 되었습니다.");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  // [수정] 장바구니에 상품 추가 (서버 연동)
  const addToCart = async (product, size, quantity = 1) => {
    try {
      // 서버 API는 productId, size, quantity를 요구함
      const response = await axios.post(
        "http://localhost:3000/api/cart",
        {
          productId: product._id || product.id, // ID 추출
          size,
          quantity,
        },
        { withCredentials: true }
      );
      // 서버에서 업데이트된 장바구니 배열을 반환함
      setCart(response.data);
    } catch (err) {
      console.error("장바구니 담기 실패:", err);
      alert("장바구니에 상품을 담지 못했습니다.");
    }
  };

  // [수정] 결제 및 주문 내역 추가
  const checkout = async () => {
    if (cart.length === 0) return false;

    try {
      // 1. 주문 생성 (로컬 상태만 업데이트 - 추후 서버 주문 API 연동 필요)
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
          isReviewed: false,
        })),
      };
      setOrders((prev) => [newOrder, ...prev]);

      // 2. 서버 장바구니 비우기
      await axios.delete("http://localhost:3000/api/cart", {
        withCredentials: true,
      });
      setCart([]);

      return true;
    } catch (err) {
      console.error("결제 처리 실패:", err);
      alert("결제 처리에 실패했습니다.");
      return false;
    }
  };

  // [추가] 수량 변경 함수
  const updateQuantity = async (productId, size, newQuantity) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/cart",
        { productId, size, quantity: newQuantity },
        { withCredentials: true }
      );
      setCart(response.data);
    } catch (err) {
      console.error("수량 변경 실패:", err);
    }
  };

  // [추가] 개별 아이템 삭제 함수
  const removeFromCart = async (productId, size) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/cart/${productId}/${size}`,
        { withCredentials: true }
      );
      setCart(response.data);
    } catch (err) {
      console.error("아이템 삭제 실패:", err);
    }
  };

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
    updateQuantity,
    removeFromCart,
    addReview,
    setProducts,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
