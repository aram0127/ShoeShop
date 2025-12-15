import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import { useAppContext } from "../context/App.context";

// 서버 설정에 맞춘 상수 정의
const POSSIBLE_CATEGORIES = [
  { value: "lifestyle", label: "라이프 스타일" },
  { value: "slipon", label: "슬립온" },
];

const POSSIBLE_SIZES = [250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300];

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
    vertical-align: middle;
  }

  th {
    background-color: #f0f0f0;
  }

  /* 테이블 내 입력 필드 스타일 */
  input[type="number"] {
    width: 60px;
    padding: 5px;
    text-align: center;
  }

  input[type="date"] {
    padding: 4px;
    font-size: 12px;
    margin-top: 4px;
    display: block; /* 날짜 필드는 줄바꿈 */
    width: 100%;
    box-sizing: border-box;
  }
`;

// 체크박스 그룹 컨테이너 (테이블 셀 내부용)
const CheckboxGroupCell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 300px; /* 너무 넓어지지 않게 제한 */
  margin: 0 auto;

  label {
    display: flex;
    align-items: center;
    font-size: 12px;
    cursor: pointer;
    background: #f9f9f9;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #eee;

    input {
      margin-right: 4px;
    }

    &:hover {
      background: #eef;
    }
  }
`;

const FormContainer = styled.form`
  max-width: 800px; /* 폼 너비 확장 */
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

  input[type="text"],
  input[type="number"],
  input[type="date"],
  select,
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  /* 폼 내부 체크박스 그룹 */
  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
    background: #fafafa;

    label {
      font-weight: normal;
      display: flex;
      align-items: center;
      cursor: pointer;

      input {
        margin-right: 5px;
      }
    }
  }

  button {
    width: 100%;
    margin-top: 20px;
    padding: 15px;
    background-color: #212a2f;
    color: white;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #000;
    }
  }
`;

// 날짜 포맷팅 유틸리티 (YYYY-MM-DD) input value용
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// ------------------------------------------------
// Tab 1: 상품 관리 (수정)
// ------------------------------------------------
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/products");
      // MongoDB ID(_id) 기준으로 정렬 (등록순)
      const sortedData = response.data.sort((a, b) => a.id.localeCompare(b.id));

      // 데이터 가공
      const mappedProducts = sortedData.map((p) => ({
        ...p,
        // 가용 사이즈 배열 복사
        selectedSizes: p.availableSizes || [],
        // 날짜 처리
        saleStartDateInput: formatDateForInput(p.saleStartDate),
        saleEndDateInput: formatDateForInput(p.saleEndDate),
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

  // 사이즈 체크박스 핸들러
  const handleSizeChange = (productId, size, isChecked) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const currentSizes = p.selectedSizes || [];
        let newSizes;
        if (isChecked) {
          newSizes = [...currentSizes, size].sort((a, b) => a - b);
        } else {
          newSizes = currentSizes.filter((s) => s !== size);
        }
        return { ...p, selectedSizes: newSizes };
      })
    );
  };

  const handleSave = async (product) => {
    const newDiscount = Math.min(
      100,
      Math.max(0, parseInt(product.discountRate) || 0)
    );

    try {
      await axios.put(
        `/api/admin/products/${product.id}`,
        {
          availableSizes: product.selectedSizes,
          discountRate: newDiscount,
          saleStartDate: product.saleStartDateInput || null,
          saleEndDate: product.saleEndDateInput || null,
        },
        { withCredentials: true }
      );
      alert(`${product.name} 상품 정보가 업데이트되었습니다.`);
      fetchProducts(); // 목록 갱신
    } catch (err) {
      console.error("수정 실패:", err);
      alert("상품 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h3>상품 수정 (가용 사이즈 및 할인 정책)</h3>
      <ProductTable>
        <colgroup>
          <col width="5%" />
          <col width="15%" />
          <col width="10%" />
          <col width="20%" />
          <col width="10%" />
          <col width="30%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th>No.</th>
            <th>상품명</th>
            <th>원가</th>
            <th>할인 설정 (할인율/기간)</th>
            <th>판매가</th>
            <th>가용 사이즈</th>
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
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
                    <span>%</span>
                  </div>
                  {/* 할인 기간 설정 추가 */}
                  <input
                    type="date"
                    placeholder="시작일"
                    value={product.saleStartDateInput}
                    onChange={(e) =>
                      handleInputChange(
                        product.id,
                        "saleStartDateInput",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="date"
                    placeholder="종료일"
                    value={product.saleEndDateInput}
                    onChange={(e) =>
                      handleInputChange(
                        product.id,
                        "saleEndDateInput",
                        e.target.value
                      )
                    }
                  />
                </div>
              </td>
              <td>
                {(
                  product.price *
                  (1 - (product.discountRate || 0) / 100)
                ).toLocaleString()}
                원
              </td>
              <td>
                <CheckboxGroupCell>
                  {POSSIBLE_SIZES.map((size) => (
                    <label key={size}>
                      <input
                        type="checkbox"
                        checked={product.selectedSizes.includes(size)}
                        onChange={(e) =>
                          handleSizeChange(product.id, size, e.target.checked)
                        }
                      />
                      {size}
                    </label>
                  ))}
                </CheckboxGroupCell>
              </td>
              <td>
                <button
                  onClick={() => handleSave(product)}
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  저장
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>
    </div>
  );
};

// ------------------------------------------------
// Tab 2: 상품 등록 (수정)
// ------------------------------------------------
const ProductRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    selectedCategories: [], // 체크박스용 배열
    materials: "wool",
    selectedSizes: [], // 체크박스용 배열
    discountRate: 0,
    saleStartDate: "",
    saleEndDate: "",
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

  // 카테고리 체크박스 변경 핸들러
  const handleCategoryChange = (value, isChecked) => {
    setFormData((prev) => {
      const current = prev.selectedCategories;
      const updated = isChecked
        ? [...current, value]
        : current.filter((item) => item !== value);
      return { ...prev, selectedCategories: updated };
    });
  };

  // 사이즈 체크박스 변경 핸들러
  const handleSizeChange = (value, isChecked) => {
    setFormData((prev) => {
      const current = prev.selectedSizes;
      const updated = isChecked
        ? [...current, value].sort((a, b) => a - b)
        : current.filter((item) => item !== value);
      return { ...prev, selectedSizes: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo) {
      alert("사진은 반드시 포함되어야 합니다.");
      return;
    }

    if (formData.selectedCategories.length === 0) {
      alert("최소 하나의 카테고리를 선택해야 합니다.");
      return;
    }

    if (formData.selectedSizes.length === 0) {
      alert("최소 하나의 사이즈를 선택해야 합니다.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);

    // 서버가 comma-separated string을 기대하므로 join
    data.append("categories", formData.selectedCategories.join(","));
    data.append("availableSizes", formData.selectedSizes.join(","));

    data.append("materials", formData.materials);
    data.append("discountRate", formData.discountRate);

    // 날짜가 있다면 추가
    if (formData.saleStartDate)
      data.append("saleStartDate", formData.saleStartDate);
    if (formData.saleEndDate) data.append("saleEndDate", formData.saleEndDate);

    data.append("images", formData.photo);

    try {
      await axios.post("/api/admin/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("상품이 성공적으로 등록되었습니다.");

      // 폼 초기화
      setFormData({
        name: "",
        description: "",
        price: "",
        selectedCategories: [],
        materials: "wool",
        selectedSizes: [],
        discountRate: 0,
        saleStartDate: "",
        saleEndDate: "",
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

      {/* 카테고리 체크박스 */}
      <p>
        <label>카테고리</label>
        <div className="checkbox-group">
          {POSSIBLE_CATEGORIES.map((cat) => (
            <label key={cat.value}>
              <input
                type="checkbox"
                checked={formData.selectedCategories.includes(cat.value)}
                onChange={(e) =>
                  handleCategoryChange(cat.value, e.target.checked)
                }
              />
              {cat.label}
            </label>
          ))}
        </div>
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
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
      </div>

      {/* 할인 및 기간 설정 */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          marginBottom: "15px",
        }}
      >
        <label style={{ display: "block", marginBottom: "10px" }}>
          할인 설정
        </label>
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>
              할인율 (%)
            </label>
            <input
              type="number"
              name="discountRate"
              min="0"
              max="100"
              value={formData.discountRate}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>시작일</label>
            <input
              type="date"
              name="saleStartDate"
              value={formData.saleStartDate}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>종료일</label>
            <input
              type="date"
              name="saleEndDate"
              value={formData.saleEndDate}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* 사이즈 체크박스 */}
      <p>
        <label>가용 사이즈</label>
        <div className="checkbox-group">
          {POSSIBLE_SIZES.map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                checked={formData.selectedSizes.includes(size)}
                onChange={(e) => handleSizeChange(size, e.target.checked)}
              />
              {size}
            </label>
          ))}
        </div>
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
              <th>No.</th>
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
