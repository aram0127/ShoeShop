import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import { mockFilters } from "../mockData";
import {
  ProductListContainer,
  TitleBar,
  Layout,
  FilterSidebar,
  ProductGrid,
  FilterSection,
  SortSelect,
  Grid,
  ProductCard,
  FilterButton,
  CollectionPath,
  PathActiveLink,
  PathChildren,
  PathChildLink,
  CloseIconSVG,
  ImageWrapper,
  AppliedFiltersContainer,
  FilterTag,
  FilterLabel,
  RemoveButton,
  ClearFiltersButton,
  ProductInfoWrapper,
  CollectionMenuContainer,
  SizeItem,
} from "./ProductList.styled";
import { Link } from "react-router-dom";

// API 호출 기본 URL
const API_BASE_URL = "http://localhost:3000/api/products";

// 경로/메뉴 필터링에 사용되는 키 목록
const PATH_CHILD_FILTER_KEYS = ["new_products", "lifestyle", "sale", "slipon"];

// ------------------------------------------------
// Helper Components
// ------------------------------------------------

// ProductCardComponent
const ProductCardComponent = React.memo(({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 이미지 경로 설정 (서버 주소와 파일 이름 연결)
  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? `http://localhost:3000/${product.images[0]}`
      : "/default_placeholder.webp";

  const imageAlt = product.name || "상품 이미지";

  const isSale = product.onSale;
  const originalPrice = Number(product.price) || 0;
  const discountRate = Number(product.discountRate) || 0;
  const finalPrice = product.finalPrice || originalPrice;

  const availableStockSet = useMemo(
    () => new Set(product.availableSizes?.map(String) || []),
    [product.availableSizes]
  );

  const ALL_SIZES_TO_RENDER = mockFilters.sizes;

  return (
    <ProductCard
      $isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/product/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ImageWrapper>
          {isSale && <span className="sale-badge">SALE ({discountRate}%)</span>}
          <img src={imageUrl} alt={imageAlt} />
        </ImageWrapper>

        <ProductInfoWrapper>
          <h4>{product.name}</h4>
          <h3>{product.categories?.join(", ") || "카테고리 없음"}</h3>
          <p className="price">
            {isSale && (
              <span className="original-price">
                {originalPrice.toLocaleString()}원
              </span>
            )}
            <span className="sale-price">{finalPrice.toLocaleString()}원</span>
          </p>
        </ProductInfoWrapper>
      </Link>

      {isHovered && (
        <div className="size-overlay">
          <div className="size-grid">
            {ALL_SIZES_TO_RENDER.map((sizeItem) => {
              const isInStock = availableStockSet.has(String(sizeItem.value));

              return (
                <SizeItem key={sizeItem.value} $isAvailable={isInStock}>
                  {sizeItem.label}
                </SizeItem>
              );
            })}
          </div>
        </div>
      )}
    </ProductCard>
  );
});

// CollectionMenu
const CollectionMenu = ({ handlePathChildFilter, activeFilters }) => {
  const pathChildFilterMap = {
    신제품: "new_products",
    라이프스타일: "lifestyle",
    세일: "sale",
    슬립온: "slipon",
  };

  const clearMainFilter = () => {
    handlePathChildFilter("discount_men_all", "discount_men_all");
  };

  return (
    <CollectionMenuContainer>
      <CollectionPath>
        <PathActiveLink onClick={clearMainFilter} style={{ cursor: "pointer" }}>
          {"남성 할인 전체"}
          {activeFilters["discount_men_all"] && (
            <CloseIconSVG
              height="11"
              width="11"
              fill="none"
              viewBox="0 0 11 11"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                stroke="#212121"
                strokeWidth="0.541667"
                x1="9.95323"
                x2="0.191143"
                y1="0.191508"
                y2="9.95359"
              />
              <line
                stroke="#212121"
                strokeWidth="0.541667"
                transform="matrix(0.707107 0.707107 0.707107 -0.707107 0.488281 0)"
                x2="13.8057"
                y1="-0.270833"
                y2="-0.270833"
              />
            </CloseIconSVG>
          )}
        </PathActiveLink>
        <PathChildren>
          {Object.entries(pathChildFilterMap).map(([label, filterKey]) => (
            <PathChildLink
              key={filterKey}
              as="button"
              onClick={() => handlePathChildFilter(filterKey, filterKey)}
              $active={activeFilters[filterKey] || false}
            >
              {label}
            </PathChildLink>
          ))}
        </PathChildren>
      </CollectionPath>
    </CollectionMenuContainer>
  );
};

// FilterComponent
const FilterComponent = ({ title, type, options, activeFilters, onToggle }) => {
  const isMultiSelect = type === "sizes" || type === "material";

  // 소재 필터가 단일 값이어도, 현재 UI는 체크박스 렌더링을 따름 (props로 전달된 isMultiSelect에 따라)
  if (isMultiSelect) {
    const containerClass =
      type === "sizes"
        ? "sizes-container"
        : type === "material"
        ? "material-list"
        : "";

    return (
      <FilterSection>
        <h4>{title}</h4>
        <div className={containerClass}>
          {options.map((option) => (
            <label key={option.value}>
              <input
                type="checkbox"
                value={option.value}
                checked={activeFilters[type]?.includes(option.value) || false}
                onChange={() => onToggle(type, option.value)}
                style={{ marginRight: "8px" }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </FilterSection>
    );
  }
  return null;
};

// ------------------------------------------------
// Main Component
// ------------------------------------------------

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState("newest");

  /**
   * activeFilters와 sortOption을 쿼리 스트링으로 변환하는 함수
   * 소재(material)는 현재 다중 선택 로직으로 처리됨.
   */
  const buildQueryString = useCallback((filters, sort) => {
    const params = new URLSearchParams();

    // 1. 카테고리/경로 필터 매핑
    if (filters["lifestyle"]) {
      params.append("category", "lifestyle");
    } else if (filters["slipon"]) {
      params.append("category", "slipon");
    }

    if (filters["new_products"]) {
      params.append("isNew", "true");
    }

    if (filters["sale"]) {
      params.append("onSale", "true");
    }

    // 2. 사이즈 필터 (sizes)
    if (filters.sizes && filters.sizes.length > 0) {
      params.append("sizes", filters.sizes.join(","));
    }

    // 3. 소재 필터 (material) - 현재 다중 선택 배열을 쉼표로 분리하여 전송
    if (filters.material && filters.material.length > 0) {
      params.append("material", filters.material.join(","));
    }

    // 4. 정렬 옵션 (sort)
    if (sort && sort !== "recommend") {
      let serverSortKey = sort;
      if (sort === "price_low") serverSortKey = "price_asc";
      else if (sort === "price_high") serverSortKey = "price_desc";
      else if (sort === "sales_high") serverSortKey = "best_selling";

      params.append("sort", serverSortKey);
    }

    return params.toString();
  }, []);

  /**
   * 서버 API 호출 함수
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const queryString = buildQueryString(activeFilters, sortOption);

    try {
      const response = await axios.get(`${API_BASE_URL}?${queryString}`);
      setProducts(response.data);
    } catch (err) {
      console.error("상품 데이터 로딩 오류:", err);
      setError("상품을 불러오는 데 실패했습니다.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, sortOption, buildQueryString]);

  /**
   * 필터 또는 정렬 옵션이 변경될 때마다 API 호출
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 필터 토글 로직
  const toggleFilter = useCallback((key, value) => {
    if (key === "sizes" || key === "material") {
      // 사이즈 및 소재 필터 (현재 다중 선택 로직)
      // *주의: 소재를 단일 선택으로 바꾸려면 이 로직을 분리해야 함
      setActiveFilters((prevFilters) => {
        const currentValues = prevFilters[key] || [];
        if (currentValues.includes(value)) {
          const newValues = currentValues.filter((v) => v !== value);
          if (newValues.length === 0) {
            const { [key]: _, ...rest } = prevFilters;
            return rest;
          }
          return { ...prevFilters, [key]: newValues };
        } else {
          return { ...prevFilters, [key]: [...currentValues, value] };
        }
      });
    } else if (
      PATH_CHILD_FILTER_KEYS.includes(key) ||
      key === "discount_men_all"
    ) {
      // 경로/특수 단일 선택 필터 (상호 배타적 토글)
      setActiveFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        const isCurrentlyActive = !!newFilters[key];

        PATH_CHILD_FILTER_KEYS.forEach(
          (filterKey) => delete newFilters[filterKey]
        );
        delete newFilters["discount_men_all"];

        if (!isCurrentlyActive) {
          newFilters[key] = true;
        } else {
          newFilters["discount_men_all"] = true;
        }

        return newFilters;
      });
    }
  }, []);

  const handlePathChildFilter = toggleFilter;

  const resetFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  // 적용된 필터 목록을 표시하기 위한 데이터 가공
  const appliedFilters = useMemo(() => {
    const filters = [];

    const categoryMap = Object.fromEntries(
      mockFilters.categories.map((c) => [c.value, c.label])
    );
    const materialMap = Object.fromEntries(
      mockFilters.material.map((m) => [m.value, m.label])
    );

    // 카테고리 및 경로 필터
    [...PATH_CHILD_FILTER_KEYS, "discount_men_all"].forEach((key) => {
      if (activeFilters[key]) {
        const label =
          categoryMap[key] ||
          (key === "discount_men_all" ? "남성 할인 전체" : key);
        filters.push({ key: key, value: label, type: "category" });
      }
    });

    // 사이즈 필터
    (activeFilters.sizes || []).forEach((size) => {
      filters.push({
        key: "sizes",
        value: `${size}mm`,
        rawValue: size,
        type: "sizes",
      });
    });

    // 소재 필터
    (activeFilters.material || []).forEach((materialValue) => {
      const label = materialMap[materialValue] || materialValue;
      filters.push({
        key: "material",
        value: label,
        rawValue: materialValue, // 필터 제거 시 사용될 서버 ENUM 값
        type: "material",
      });
    });

    return filters;
  }, [activeFilters]);

  /**
   * 최종 판매가(finalPrice)를 기준으로 클라이언트에서 재정렬
   */
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    if (sortOption === "price_low") {
      // 가격 낮은 순: finalPrice 기준으로 오름차순 정렬
      result = [...result].sort(
        (a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price)
      );
    } else if (sortOption === "price_high") {
      // 가격 높은 순: finalPrice 기준으로 내림차순 정렬
      result = [...result].sort(
        (a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price)
      );
    } else if (sortOption === "sales_high") {
      // 판매순 (salesCount 활용)
      result = [...result].sort((a, b) => {
        const salesA = a.salesCount || 0;
        const salesB = b.salesCount || 0;
        return salesB - salesA; // 판매량이 높은 순서 (내림차순)
      });
    } else if (sortOption === "newest") {
      // 최신등록순 (createdAt 활용)
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // 최신 날짜가 위로 오도록 (내림차순)
      });
    } else if (sortOption === "recommend") {
      result = [...products].sort((a, b) => {
        const scoreA =
          a.salesCount * 0.7 + new Date(a.createdAt).getTime() * 0.3;
        const scoreB =
          b.salesCount * 0.7 + new Date(b.createdAt).getTime() * 0.3;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [products, sortOption]);

  return (
    <ProductListContainer>
      <TitleBar>
        <h1>남성 라이프스타일 신발</h1>
      </TitleBar>

      <CollectionMenu
        handlePathChildFilter={handlePathChildFilter}
        activeFilters={activeFilters}
      />

      <Layout>
        {/* Filter Sidebar */}
        <FilterSidebar>
          <AppliedFiltersContainer>
            {appliedFilters.map((filter) => (
              <FilterTag key={`${filter.key}-${filter.value}`}>
                <FilterLabel>{filter.value}</FilterLabel>
                <RemoveButton
                  onClick={() => {
                    if (filter.type === "sizes" || filter.type === "material") {
                      const valueToRemove =
                        filter.rawValue || filter.value.replace("mm", "");
                      // 다중 선택 필터 제거 시 rawValue 사용
                      toggleFilter(filter.key, valueToRemove);
                    } else {
                      // 경로 필터 제거 시 key 사용
                      toggleFilter(filter.key, filter.key);
                    }
                  }}
                >
                  <span aria-hidden="true">×</span>
                </RemoveButton>
              </FilterTag>
            ))}
          </AppliedFiltersContainer>
          {appliedFilters.length > 0 && (
            <ClearFiltersButton onClick={resetFilters}>
              초기화
            </ClearFiltersButton>
          )}
          <FilterComponent
            title="사이즈"
            type="sizes"
            options={mockFilters.sizes}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
          />
          <FilterComponent
            title="소재"
            type="material"
            options={mockFilters.material}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
          />
        </FilterSidebar>

        {/* Product Grid */}
        <ProductGrid>
          <header>
            <span>{filteredAndSortedProducts.length}개 제품</span>

            <SortSelect
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {mockFilters.sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SortSelect>
          </header>

          <Grid>
            {loading ? (
              <p>상품을 불러오는 중...</p>
            ) : error ? (
              <p>{error}</p>
            ) : filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <ProductCardComponent key={product._id} product={product} />
              ))
            ) : (
              <p>필터 조건에 맞는 상품이 없습니다.</p>
            )}
          </Grid>
        </ProductGrid>
      </Layout>
    </ProductListContainer>
  );
};

export default ProductList;
