import React, { useState, useMemo, useCallback } from "react";
import { mockProducts, mockFilters } from "../mockData"; // 추가된 mockData 파일 사용
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
  // resetFilters,
  ProductInfoWrapper,
  CollectionMenuContainer,
  // SizeOverlay,
  SizeItem,
} from "./ProductList.styled"; // 추가된 styled component 파일 사용
import { Link } from "react-router-dom"; // 상세 페이지 이동을 위해 Link 추가

// PathChildren 필터 키 목록 (CollectionMenu와 ProductList에서 사용)
const PATH_CHILD_FILTER_KEYS = ["new_products", "lifestyle", "sale", "slip_on"];

// ------------------------------------------------
// Helper Components
// ------------------------------------------------

// 상품 경로 메뉴
const CollectionMenu = ({ handlePathChildFilter, activeFilters }) => {
  // PathChildLink의 값에 해당하는 필터 키
  const pathChildFilterMap = {
    신제품: "new_products",
    라이프스타일: "lifestyle",
    세일: "sale",
    슬립온: "slip_on",
  };

  // '남성 할인 전체' (메인 경로) 필터를 해제/토글하는 함수
  const clearMainFilter = () => {
    // 'discount_men_all' 필터는 토글 방식 (PathActiveLink는 Category 필터 중 하나로 간주)
    handlePathChildFilter("discount_men_all", "discount_men_all");
  };

  return (
    <CollectionMenuContainer>
      <CollectionPath>
        {/* 활성화된 메인 경로 (토글 카테고리 필터) */}
        <PathActiveLink onClick={clearMainFilter} style={{ cursor: "pointer" }}>
          {"남성 할인 전체"}
          {/* '남성 할인 전체'가 활성화되어 있으면 X 아이콘 표시 */}
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
              as="button" // Link 대신 button 사용
              onClick={() => handlePathChildFilter(filterKey, filterKey)}
              $active={activeFilters[filterKey] || false} // 활성화 상태 표시
            >
              {label}
            </PathChildLink>
          ))}
        </PathChildren>
      </CollectionPath>
    </CollectionMenuContainer>
  );
};

const ProductCardComponent = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isSale = product.price !== product.salePrice;
  const imageUrl = product.imageUrls[0]?.url || "/default_placeholder.webp";
  const imageAlt = product.imageUrls[0]?.alt || product.name;

  // 1. 사용할 상품 (예: ID 101) 선택
  const targetProductId = 101;
  const targetProduct = mockProducts.find((p) => p.id === targetProductId);

  // 2. Set을 이용한 재고 확인 로직 준비 (includes() 대안)
  const availableStockSet = new Set(
    targetProduct.sizes.map((size) => size.toString())
  );

  // 3. 렌더링할 전체 사이즈 목록 (mockFilters에서 가져옴)
  const ALL_SIZES_TO_RENDER = mockFilters.sizes; // [{value: '250', label: '250'}, ...]

  return (
    <ProductCard
      $isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. 상품 이미지 및 기본 정보 (가격, 소재 포함) */}
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ImageWrapper>
          {isSale && <span className="sale-badge">SALE</span>}
          <img src={imageUrl} alt={imageAlt} />
        </ImageWrapper>

        {/* 2. 상품 이름, 카테고리, 가격을 ProductInfoWrapper로 감싸서 레이어 분리 */}
        <ProductInfoWrapper>
          <h4>{product.name}</h4>
          <h3>{product.category.join(", ")}</h3>
          <p className="price">
            {isSale && (
              <span className="original-price">
                {product.price.toLocaleString()}원
              </span>
            )}
            <span className="sale-price">
              {product.salePrice.toLocaleString()}원
            </span>
          </p>
        </ProductInfoWrapper>
      </Link>

      {/* 3. 호버 시 나타나는 사이즈 오버레이 (Link 외부에 위치) */}
      {isHovered && targetProduct && (
        <div className="size-overlay">
          <div className="size-grid">
            {ALL_SIZES_TO_RENDER.map((sizeItem) => {
              const isInStock = availableStockSet.has(sizeItem.value);

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
};

const FilterComponent = ({ title, type, options, activeFilters, onToggle }) => {
  const isMultiSelect = type === "sizes" || type === "materials"; // 다중 선택 필터

  if (isMultiSelect) {
    // 사이즈, 소재 (체크박스 스타일)
    const containerClass =
      type === "sizes"
        ? "sizes-container"
        : type === "materials"
        ? "material-list"
        : ""; // 소재에 명확한 클래스 부여

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
  } else {
    return (
      <FilterSection>
        <h4>{title}</h4>
        <div>
          {options.map((option) => (
            <FilterButton
              key={option.value}
              $active={activeFilters[option.value] || false}
              onClick={() => onToggle(option.value, option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
        </div>
      </FilterSection>
    );
  }
};

// ------------------------------------------------
// Filtering & Sorting Logic
// ------------------------------------------------

// 필터링 및 정렬 로직 (카테고리 레이블 매핑 수정)
const applyFiltersAndSort = (products, activeFilters, sortOption) => {
  // 1. Filtering Logic (항목 내 OR, 항목 간 AND)
  const filtered = products.filter((product) => {
    // --- 1-1. Category & Path Filter (OR) ---
    // 활성화된 모든 카테고리/경로 필터 키를 수집합니다. (discount_men_all 포함)
    const allCategoryKeys = [
      ...mockFilters.categories.map((cat) => cat.value), // 사이드바 카테고리 키
      "discount_men_all", // 메인 경로 필터 키
    ].filter((key) => activeFilters[key]);

    // 'discount_men_all' 필터는 상품 필터링을 하지 않고 경로 표시에만 사용되는 것으로 간주하여 제외합니다.
    const activeContentFilters = allCategoryKeys.filter(
      (key) => key !== "discount_men_all"
    );

    if (activeContentFilters.length > 0) {
      const isContentCategoryMatch = activeContentFilters.some((filterKey) => {
        // 필터 키(e.g., 'new_products')에 해당하는 레이블(e.g., '신제품')을 찾습니다.
        // mockFilters.categories는 { value: key, label: label } 형태이므로,
        // key를 통해 label을 찾아 상품의 category 배열과 비교합니다.
        const categoryLabel =
          mockFilters.categories.find((c) => c.value === filterKey)?.label ||
          filterKey;

        // 상품의 category 배열(레이블로 구성됨: ["라이프스타일", "신제품"])에 해당 레이블이 포함되어 있는지 확인
        return product.category.includes(categoryLabel);
      });
      if (!isContentCategoryMatch) return false;
    }

    // --- 1-2. Size Filter (OR) ---
    const sizeFilters = activeFilters.sizes || [];
    if (sizeFilters.length > 0) {
      // sizeFilters는 문자열(예: '270')을 포함하므로, 상품의 sizes(숫자 배열)와 비교하기 위해 숫자로 변환합니다.
      const isSizeMatch = sizeFilters.some((size) =>
        product.sizes.includes(parseInt(size))
      );
      if (!isSizeMatch) return false;
    }

    // --- 1-3. Material Filter (OR) ---
    const materialFilters = activeFilters.materials || [];
    if (materialFilters.length > 0) {
      // materialFilters는 상품 데이터의 material 값(e.g., '울')을 직접 포함합니다.
      const isMaterialMatch = materialFilters.some(
        (materialValue) => product.material === materialValue
      );
      if (!isMaterialMatch) return false;
    }

    return true;
  });

  // 2. Sorting Logic (mockData.js의 수정된 value에 맞게 업데이트)
  const sorted = [...filtered].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.registeredAt) - new Date(a.registeredAt);
      case "price_low":
        return a.salePrice - b.salePrice;
      case "price_high":
        return b.salePrice - a.salePrice;
      case "sales_high":
        return b.sales - a.sales;
      default:
        // 'recommend' 또는 기본값
        return 0;
    }
  });

  return sorted;
};

// ------------------------------------------------
// Main Component
// ------------------------------------------------

const ProductList = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState("newest"); // 정렬 상태

  // 필터 토글 로직
  const toggleFilter = useCallback((key, value) => {
    if (key === "sizes" || key === "materials") {
      // 다중 선택 필터 (sizes, materials)
      setActiveFilters((prevFilters) => {
        const currentValues = prevFilters[key] || [];
        if (currentValues.includes(value)) {
          // 제거
          const newValues = currentValues.filter((v) => v !== value);
          if (newValues.length === 0) {
            const { [key]: _, ...rest } = prevFilters;
            return rest;
          }
          return { ...prevFilters, [key]: newValues };
        } else {
          // 추가
          return { ...prevFilters, [key]: [...currentValues, value] };
        }
      });
    } else {
      // 단일 선택 필터 (category, PathChildren 필터 포함)
      setActiveFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        const isCurrentlyActive = newFilters[key];

        if (PATH_CHILD_FILTER_KEYS.includes(key)) {
          // PathChildren 필터: 배타적 단일 선택 (PathChildren 내에서만)

          // 1. 현재 활성화된 Path Children 필터만 모두 해제합니다.
          PATH_CHILD_FILTER_KEYS.forEach((filterKey) => {
            delete newFilters[filterKey];
          });

          // 2. 클릭한 필터가 현재 비활성화 상태였다면 활성화합니다.
          if (!isCurrentlyActive) {
            newFilters[key] = true;
          }
        } else {
          // 일반 카테고리 필터 ('discount_men_all' 포함): 토글
          if (isCurrentlyActive) {
            delete newFilters[key];
          } else {
            newFilters[key] = true;
          }
        }

        return newFilters;
      });
    }
  }, []);

  // CollectionMenu의 PathChildLink에서 사용할 핸들러 (toggleFilter를 그대로 사용)
  const handlePathChildFilter = toggleFilter;

  const resetFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    return applyFiltersAndSort(mockProducts, activeFilters, sortOption);
  }, [activeFilters, sortOption]);

  // 적용된 필터 목록을 표시하기 위한 가공 및 제거 로직 개선
  const appliedFilters = useMemo(() => {
    const filters = [];

    // 필터 키-레이블 매핑 생성
    const categoryMap = Object.fromEntries(
      mockFilters.categories.map((c) => [c.value, c.label])
    );
    // 소재 필터의 rawValue와 label 매핑
    const materialMap = Object.fromEntries(
      mockFilters.materials.map((m) => [m.value, m.label])
    );

    // 카테고리 및 경로 필터 (key로 저장되어 있음)
    [...PATH_CHILD_FILTER_KEYS, "discount_men_all"].forEach((key) => {
      if (activeFilters[key]) {
        // key를 통해 label을 찾거나 기본값(할인 전체) 사용
        const label =
          categoryMap[key] ||
          (key === "discount_men_all" ? "남성 할인 전체" : key);
        filters.push({ key: key, value: label, type: "category" });
      }
    });

    // 사이즈 (key: sizes, value: '250mm', rawValue: '250')
    (activeFilters.sizes || []).forEach((size) => {
      filters.push({
        key: "sizes",
        value: `${size}mm`,
        rawValue: size,
        type: "sizes",
      });
    });

    // 소재 (key: materials, value: '가볍고 시원한 tree', rawValue: '나무 섬유')
    (activeFilters.materials || []).forEach((materialValue) => {
      const label = materialMap[materialValue] || materialValue;
      filters.push({
        key: "materials",
        value: label,
        rawValue: materialValue,
        type: "materials",
      });
    });

    return filters;
  }, [activeFilters]);

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
          {/* Applied Filters Display */}
          <AppliedFiltersContainer>
            {appliedFilters.map((filter) => (
              <FilterTag key={`${filter.key}-${filter.value}`}>
                <FilterLabel>{filter.value}</FilterLabel>
                <RemoveButton
                  onClick={() => {
                    if (
                      filter.type === "sizes" ||
                      filter.type === "materials"
                    ) {
                      const valueToRemove =
                        filter.rawValue || filter.value.replace("mm", "");
                      // 개별 필터 제거 로직
                      toggleFilter(filter.key, valueToRemove);
                    } else {
                      // 개별 필터 제거 로직
                      toggleFilter(filter.key, filter.key);
                    }
                  }}
                >
                  <span aria-hidden="true">×</span>
                </RemoveButton>
              </FilterTag>
            ))}
          </AppliedFiltersContainer>
          {/*모든 필터를 지우는 초기화 버튼 */}
          {appliedFilters.length > 0 && (
            <ClearFiltersButton onClick={resetFilters}>
              초기화
            </ClearFiltersButton>
          )}
          {/* 사이즈 필터 */}
          <FilterComponent
            title="사이즈"
            type="sizes"
            options={mockFilters.sizes}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
          />
          {/* 소재 필터 */}
          <FilterComponent
            title="소재"
            type="materials"
            options={mockFilters.materials}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
          />
        </FilterSidebar>

        {/* Product Grid */}
        <ProductGrid>
          <header>
            <span>{filteredAndSortedProducts.length}개 제품</span>

            {/* Sorting Select */}
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

          {/* Product Grid */}
          <Grid>
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <ProductCardComponent key={product.id} product={product} />
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
