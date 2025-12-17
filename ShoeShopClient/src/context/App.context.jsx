import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { mockProducts } from "../mockData"; // mockOrders는 제거

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState([]); // 초기값 빈 배열로 변경
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

  // [추가] 주문 내역 불러오기 함수
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orders", {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (err) {
      console.error("주문 내역 불러오기 실패", err);
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
          // 로그인 상태라면 주문 내역도 함께 불러옴
          fetchOrders();
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
    fetchOrders(); // [추가] 로그인 시 주문 내역 불러오기
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
      setOrders([]); // [추가] 로그아웃 시 주문 내역 초기화
      setUser(null);
      alert("로그아웃 되었습니다.");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  // 장바구니에 상품 추가
  const addToCart = async (product, size, quantity = 1) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/cart",
        {
          productId: product._id || product.id,
          size,
          quantity,
        },
        { withCredentials: true }
      );
      setCart(response.data);
    } catch (err) {
      console.error("장바구니 담기 실패:", err);
      alert("장바구니에 상품을 담지 못했습니다.");
    }
  };

  // [수정] 결제 및 주문 내역 추가 (서버 연동)
  const checkout = async () => {
    if (cart.length === 0) return false;

    try {
      // 1. 서버에 주문 생성 요청 (이 API 내부에서 장바구니 비우기까지 처리됨)
      await axios.post(
        "http://localhost:3000/api/orders",
        {},
        { withCredentials: true }
      );

      // 2. 클라이언트 상태 업데이트
      setCart([]); // 장바구니 비우기

      // 3. 최신 주문 내역 다시 불러오기 (DB에 저장된 내역 확인)
      await fetchOrders();

      return true;
    } catch (err) {
      console.error("결제 처리 실패:", err);
      alert("결제 처리에 실패했습니다.");
      return false;
    }
  };

  // 수량 변경 함수
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

  // 개별 아이템 삭제 함수
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

  // [수정 필요] 리뷰 작성 로직도 추후 서버 API로 변경 권장 (현재는 로컬 state만 변경)
  const addReview = (productId, rating, content) => {
    // 힌트: 리뷰 작성 후에도 fetchOrders()를 호출하여 서버 데이터를 반영하는 것이 좋습니다.
    setOrders((prevOrders) =>
      prevOrders.map((order) => ({
        ...order,
        products: order.items.map(
          (
            product // models/Order.js를 보면 필드명이 products가 아니라 items임
          ) =>
            product.product.toString() === productId && !product.isReviewed
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
