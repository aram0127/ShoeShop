import React, { useState, useMemo, useEffect } from "react";
import styled, { css } from "styled-components";
import { mockProducts, mockOrders } from "../mockData"; // Mock 데이터 임시 사용
import { useAppContext } from "../context/App.context"; // 전역 상태 관리를 위해 Context 사용

const AdminContainer = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 20px;
`;

const TabNav = styled.div`
  display: flex;
  margin-bottom: 30px;

  button {
    padding: 15px 25px;
    border: 1px solid #ccc;
    border-bottom: none;
    background-color: #f9f9f9;
    cursor: pointer;
    font-size: 16px;

    ${(props) =>
      props.$active &&
      css`
        background-color: #fff;
        border-color: #000;
        border-bottom: 1px solid #fff;
        font-weight: bold;
      `}
  }
`;

// ------------------------------------------------
// Tab 1: 상품 관리 (11, 12번)
// ------------------------------------------------

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    font-size: 14px;
  }

  th {
    background-color: #f0f0f0;
  }

  input {
    width: 60px;
    padding: 5px;
    text-align: center;
  }
  select {
    padding: 5px;
  }
`;

const ProductManagement = ({ products, updateProduct }) => {
  const [localProducts, setLocalProducts] = useState(products);

  const handleInputChange = (id, field, value) => {
    setLocalProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = (product) => {
    // 11. 가용 사이즈 변경 (현재는 String 배열로 임시 처리)
    const newSizes = product.sizes
      .map((s) => parseInt(s))
      .filter((s) => !isNaN(s));
    // 12. 할인 정책 변경 (0~100 사이)
    const newDiscount = Math.min(
      100,
      Math.max(0, parseInt(product.discountRate) || 0)
    );

    // 할인율 적용된 최종 판매가 계산 (서버 로직 가정)
    const newSalePrice = product.price * (1 - newDiscount / 100);

    updateProduct(product.id, {
      sizes: newSizes,
      discountRate: newDiscount,
      salePrice: Math.round(newSalePrice / 10) * 10, // 10원 단위 반올림
    });
    alert(`${product.name} 상품 정보가 업데이트되었습니다.`);
  };

  return (
    <div>
      <h3>상품 수정 (가용 사이즈 및 할인율)</h3>
      <ProductTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>상품명</th>
            <th>원가</th>
            <th>할인율 (%)</th>
            <th>판매가</th>
            <th>가용 사이즈</th>
            <th>저장</th>
          </tr>
        </thead>
        <tbody>
          {localProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString()}원</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={product.discountRate || 0}
                  onChange={(e) =>
                    handleInputChange(
                      product.id,
                      "discountRate",
                      e.target.value
                    )
                  }
                />
              </td>
              <td>
                {(
                  product.price *
                  (1 - (product.discountRate || 0) / 100)
                ).toLocaleString()}
                원
              </td>
              <td>
                <input
                  type="text"
                  value={product.sizes.join(", ")}
                  onChange={(e) =>
                    handleInputChange(
                      product.id,
                      "sizes",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  style={{ width: "150px" }}
                />
              </td>
              <td>
                <button onClick={() => handleSave(product)}>저장</button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>
    </div>
  );
};

// ------------------------------------------------
// Tab 2: 상품 등록 (13번)
// ------------------------------------------------

const ProductRegistration = ({ addProduct }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "라이프스타일",
    price: 0,
    discountRate: 0,
    sizes: "250, 260",
    material: "울",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files) {
      setNewProduct((p) => ({ ...p, photo: files[0].name })); // 파일 이름만 저장
    } else {
      setNewProduct((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.photo) {
      alert("13. 사진은 반드시 포함되어야 합니다.");
      return;
    }

    // 13. 새 상품 등록
    const sizesArray = newProduct.sizes
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((s) => !isNaN(s));
    const finalProduct = {
      ...newProduct,
      id: mockProducts.length + 101, // 임시 ID
      category: [newProduct.category],
      price: parseInt(newProduct.price),
      discountRate: parseInt(newProduct.discountRate),
      salePrice:
        parseInt(newProduct.price) *
        (1 - parseInt(newProduct.discountRate) / 100),
      sizes: sizesArray,
      sales: 0,
      registeredAt: new Date().toISOString(),
    };

    addProduct(finalProduct);
    alert(`${finalProduct.name} 상품이 등록되었습니다.`);
    setNewProduct({
      name: "",
      category: "라이프스타일",
      price: 0,
      discountRate: 0,
      sizes: "250, 260",
      material: "울",
      photo: null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "500px", padding: "20px", border: "1px solid #ccc" }}
    >
      <h3>새 상품 등록</h3>
      <p>
        <label>
          상품명:{" "}
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleChange}
            required
          />
        </label>
      </p>
      <p>
        <label>
          카테고리:{" "}
          <select
            name="category"
            value={newProduct.category}
            onChange={handleChange}
          >
            {["라이프스타일", "슬립온"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </p>
      <p>
        <label>
          원가:{" "}
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            required
          />
        </label>
      </p>
      <p>
        <label>
          할인율 (%):{" "}
          <input
            type="number"
            name="discountRate"
            min="0"
            max="100"
            value={newProduct.discountRate}
            onChange={handleChange}
          />
        </label>
      </p>
      <p>
        <label>
          가용 사이즈 (쉼표로 구분):{" "}
          <input
            type="text"
            name="sizes"
            value={newProduct.sizes}
            onChange={handleChange}
            required
          />
        </label>
      </p>
      <p>
        <label>
          소재:{" "}
          <input
            type="text"
            name="material"
            value={newProduct.material}
            onChange={handleChange}
            required
          />
        </label>
      </p>
      <p>
        <label>
          사진:{" "}
          <input type="file" name="photo" onChange={handleChange} required />
        </label>
      </p>
      <button type="submit">상품 등록</button>
    </form>
  );
};

// ------------------------------------------------
// Tab 3: 판매 현황 (14번)
// ------------------------------------------------

const SalesReport = ({ products, orders }) => {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const salesData = useMemo(() => {
    // 상품별 판매 수량 및 매출 집계
    const productStats = products.reduce((acc, product) => {
      acc[product.id] = {
        name: product.name,
        totalSalesCount: 0,
        totalRevenue: 0,
      };
      return acc;
    }, {});

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 14. 조회 기간 필터링
    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      if (orderDate >= start && orderDate <= end) {
        order.products.forEach((item) => {
          if (productStats[item.productId]) {
            // 14. 매출은 할인율이 적용된 금액이어야 함 (item.price는 이미 할인 적용된 금액임)
            productStats[item.productId].totalSalesCount += item.quantity;
            productStats[item.productId].totalRevenue += item.price;
          }
        });
      }
    });

    return Object.values(productStats);
  }, [products, orders, startDate, endDate]);

  return (
    <div>
      <h3>판매 현황</h3>

      {/* 14. 조회 기간 필터링 제공 */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          시작일:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "15px" }}>
          종료일:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <ProductTable>
        <thead>
          <tr>
            <th>상품명</th>
            <th>14. 판매 수량</th>
            <th>14. 매출 (할인 적용)</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((data, index) => (
            <tr key={index}>
              <td>{data.name}</td>
              <td>{data.totalSalesCount.toLocaleString()}개</td>
              <td>{data.totalRevenue.toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </ProductTable>
    </div>
  );
};

// ------------------------------------------------
// Main Admin Component
// ------------------------------------------------

const AdminPage = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true); // 관리자 로그인 가정
  const [activeTab, setActiveTab] = useState("management");

  // Context에서 상품 및 주문 데이터 가져오기 (실제로는 서버와 통신해야 함)
  const { products: allProducts, orders: allOrders } = useAppContext();
  const [products, setProducts] = useState(
    allProducts.map((p) => ({
      ...p,
      discountRate: Math.round((1 - p.salePrice / p.price) * 100), // 임시 할인율 계산
    }))
  );

  // Mock 데이터 변경 함수 (실제로는 DB 업데이트 API 호출)
  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  if (!isAdminLoggedIn) {
    // 세션 기반 인증 가정
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        관리자 로그인이 필요합니다.
      </div>
    );
  }

  return (
    <AdminContainer>
      <h1>관리자 페이지</h1>

      <TabNav>
        <button
          $active={activeTab === "management"}
          onClick={() => setActiveTab("management")}
        >
          상품 수정
        </button>
        <button
          $active={activeTab === "registration"}
          onClick={() => setActiveTab("registration")}
        >
          상품 등록
        </button>
        <button
          $active={activeTab === "sales"}
          onClick={() => setActiveTab("sales")}
        >
          판매 현황
        </button>
      </TabNav>

      {activeTab === "management" && (
        <ProductManagement products={products} updateProduct={updateProduct} />
      )}
      {activeTab === "registration" && (
        <ProductRegistration addProduct={addProduct} />
      )}
      {activeTab === "sales" && (
        <SalesReport products={products} orders={allOrders} />
      )}
    </AdminContainer>
  );
};

export default AdminPage;
