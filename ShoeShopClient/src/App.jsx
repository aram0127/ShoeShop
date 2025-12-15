import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/App.context";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CartSidebar from "./components/common/CartSidebar";
import ThreeCardsSection from "./components/home/ThreeCardsSection";

import LandingPage from "./pages/LandingPage";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import MyPage from "./pages/MyPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [isCartVisible, setIsCartVisible] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        <Header onCartClick={() => setIsCartVisible(true)} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>

        {/* ThreeCardsSection 추가: 모든 페이지 하단에 표시 */}
        <ThreeCardsSection />

        <Footer />

        <CartSidebar
          isVisible={isCartVisible}
          onClose={() => setIsCartVisible(false)}
        />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
