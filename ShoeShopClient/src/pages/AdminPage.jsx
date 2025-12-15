import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import { useAppContext } from "../context/App.context";

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
    width: 80px;
    padding: 5px;
    text-align: center;
  }
  select {
    padding: 5px;
  }
`;

const FormContainer = styled.form`
  max-width: 600px;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;

  h3 {
    margin-top: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  p {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  label {
    font-weight: bold;
    font-size: 14px;
  }

  input,
  select,
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  button {
    width: 100%;
    margin-top: 10px;
    background-color: #212a2f;
    color: white;
    &:hover {
      background-color: #000;
    }
  }
`;

// ------------------------------------------------
// Tab 1: 상품 관리
// ------------------------------------------------
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/products");

      // MongoDB ID(_id) 기준으로 정렬 (등록순)
      // a.id와 b.id는 문자열이므로 localeCompare 사용
      const sortedData = response.data.sort((a, b) => a.id.localeCompare(b.id));

      const mappedProducts = sortedData.map((p) => ({
        ...p,
        sizesInput: p.availableSizes.join(", "),
      }));
      setProducts(mappedProducts);
    } catch (err) {
      console.error("상품 로딩 실패:", err);
      alert("상품 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async (product) => {
    const newSizes = product.sizesInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((s) => !isNaN(s));

    const newDiscount = Math.min(
      100,
      Math.max(0, parseInt(product.discountRate) || 0)
    );

    try {
      await axios.put(
        `/api/admin/products/${product.id}`,
        {
          availableSizes: newSizes,
          discountRate: newDiscount,
        },
        { withCredentials: true }
      );
      alert(`${product.name} 상품 정보가 업데이트되었습니다.`);
      fetchProducts();
    } catch (err) {
      console.error("수정 실패:", err);
      alert("상품 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h3>상품 수정 (가용 사이즈 및 할인율)</h3>
      <ProductTable>
        <thead>
          <tr>
            <th>No.</th>
            <th>상품명</th>
            <th>원가</th>
            <th>할인율 (%)</th>
            <th>판매가 (예상)</th>
            <th>가용 사이즈 (쉼표 구분)</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
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
                  value={product.sizesInput}
                  onChange={(e) =>
                    handleInputChange(product.id, "sizesInput", e.target.value)
                  }
                  style={{ width: "200px", textAlign: "left" }}
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
// Tab 2: 상품 등록
// ------------------------------------------------
const ProductRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categories: "lifestyle",
    materials: "wool",
    availableSizes: "250, 260, 270, 280",
    discountRate: 0,
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo) {
      alert("사진은 반드시 포함되어야 합니다.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("categories", formData.categories);
    data.append("materials", formData.materials);
    data.append("availableSizes", formData.availableSizes);
    data.append("discountRate", formData.discountRate);
    data.append("images", formData.photo);

    try {
      await axios.post("/api/admin/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("상품이 성공적으로 등록되었습니다.");
      setFormData({
        name: "",
        description: "",
        price: "",
        categories: "lifestyle",
        materials: "wool",
        availableSizes: "250, 260, 270, 280",
        discountRate: 0,
        photo: null,
      });
    } catch (err) {
      console.error("등록 실패:", err);
      alert("상품 등록에 실패했습니다.");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h3>새 상품 등록</h3>
      <p>
        <label>상품명</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </p>
      <p>
        <label>간단 소개</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
        />
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <p style={{ flex: 1 }}>
          <label>카테고리 (쉼표 구분)</label>
          <input
            type="text"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            placeholder="예: lifestyle, slipon"
          />
        </p>
        <p style={{ flex: 1 }}>
          <label>소재</label>
          <select
            name="materials"
            value={formData.materials}
            onChange={handleChange}
          >
            <option value="wool">Wool</option>
            <option value="tree">Tree</option>
            <option value="cotton">Cotton</option>
            <option value="canvas">Canvas</option>
            <option value="leather">Leather</option>
          </select>
        </p>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <p style={{ flex: 1 }}>
          <label>가격 (원)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </p>
        <p style={{ flex: 1 }}>
          <label>할인율 (%)</label>
          <input
            type="number"
            name="discountRate"
            min="0"
            max="100"
            value={formData.discountRate}
            onChange={handleChange}
          />
        </p>
      </div>
      <p>
        <label>가용 사이즈 (쉼표로 구분, 예: 250, 260)</label>
        <input
          type="text"
          name="availableSizes"
          value={formData.availableSizes}
          onChange={handleChange}
          required
        />
      </p>
      <p>
        <label>상품 이미지 (필수)</label>
        <input type="file" name="photo" onChange={handleChange} required />
      </p>
      <button type="submit">상품 등록하기</button>
    </FormContainer>
  );
};

// ------------------------------------------------
// Tab 3: 판매 현황
// ------------------------------------------------
const SalesReport = () => {
  // 로컬 시간 기준 날짜 포맷팅 함수 (YYYY-MM-DD)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState(formatDate(firstDay));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      // 전체 상품 목록 조회
      // 해당 기간의 판매 내역 조회
      const [productsRes, salesRes] = await Promise.all([
        axios.get("/api/products"),
        axios.get("/api/admin/sales", {
          params: { startDate, endDate },
          withCredentials: true,
        }),
      ]);

      const allProducts = productsRes.data;
      const salesStats = salesRes.data;

      // 데이터 병합: 전체 상품에 대해 판매 내역이 있으면 매핑, 없으면 0 처리
      const mergedData = allProducts.map((product) => {
        const stat = salesStats.find((s) => s._id === product.id);
        return {
          _id: product.id,
          productName: product.name,
          totalQuantity: stat ? stat.totalQuantity : 0,
          totalRevenue: stat ? stat.totalRevenue : 0,
        };
      });

      // 정렬: Object ID 순 (등록순)
      mergedData.sort((a, b) => a._id.localeCompare(b._id));

      setSalesData(mergedData);
    } catch (err) {
      console.error("판매 현황 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return (
    <div>
      <h3>판매 현황</h3>

      {/* 14. 조회 기간 필터링 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <label>조회 기간:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: "5px" }}
        />
        <span>~</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: "5px" }}
        />
        <button
          onClick={fetchSales}
          style={{
            padding: "6px 12px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          조회
        </button>
      </div>

      {loading ? (
        <div>집계 중...</div>
      ) : (
        <ProductTable>
          <thead>
            <tr>
              <th>순위</th>
              <th>상품명</th>
              <th>판매 수량</th>
              <th>총 매출</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((data, index) => (
              <tr key={data._id}>
                <td>{index + 1}</td>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  {data.productName}
                </td>
                <td>{data.totalQuantity.toLocaleString()}개</td>
                <td style={{ fontWeight: "bold", color: "#388e3c" }}>
                  {data.totalRevenue.toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </ProductTable>
      )}
    </div>
  );
};

// ------------------------------------------------
// Main Admin Component
// ------------------------------------------------
const AdminPage = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState("management");

  // 관리자 권한 체크
  if (!user || user.role !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <h2>관리자 권한이 필요합니다.</h2>
        <p>로그인 후 이용해주세요.</p>
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

      {activeTab === "management" && <ProductManagement />}
      {activeTab === "registration" && <ProductRegistration />}
      {activeTab === "sales" && <SalesReport />}
    </AdminContainer>
  );
};

export default AdminPage;
