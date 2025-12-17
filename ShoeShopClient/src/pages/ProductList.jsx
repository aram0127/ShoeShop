import React, { useState, useMemo, useCallback, useEffect } from "react";
// mockData에서 mockProducts는 제거하고, 스타일과 기본 아이콘 등은 그대로 사용
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

// ------------------------------------------------
// [서버 스펙과 동기화된 정적 필터 옵션]
// ------------------------------------------------
const SERVER_FILTER_OPTIONS = {
  // 서버 Product.js의 availableSizes: 250 ~ 300
  sizes: [250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300].map(
    (size) => ({ value: size.toString(), label: size.toString() })
  ),

  // 서버 Product.js의 material: wool, tree, cotton, canvas, leather
  materials: [
    { value: "tree", label: "가볍고 시원한 Tree" }, // 나무 섬유
    { value: "cotton", label: "면" },
    { value: "wool", label: "부드럽고 따뜻한 Wool" },
    { value: "canvas", label: "캔버스" },
    { value: "leather", label: "가죽" }, // 사탕수수 대신 서버 스펙인 leather 사용
  ],

  // 정렬 옵션 (클라이언트에서 처리)
  sortOptions: [
    { value: "recommend", label: "추천순" },
    { value: "sales_high", label: "판매순" },
    { value: "price_low", label: "가격 낮은순" },
    { value: "price_high", label: "가격 높은순" },
    { value: "newest", label: "최신 등록순" },
  ],
};

// PathChildren 필터 키 목록
const PATH_CHILD_FILTER_KEYS = ["new_products", "lifestyle", "sale", "slip_on"];

// ------------------------------------------------
// Helper Components
// ------------------------------------------------

// [수정] resetFilters prop 추가
const CollectionMenu = ({
  handlePathChildFilter,
  activeFilters,
  resetFilters,
}) => {
  const pathChildFilterMap = {
    신제품: "new_products",
    라이프스타일: "lifestyle",
    세일: "sale",
    슬립온: "slip_on",
  };

  return (
    <CollectionMenuContainer>
      <CollectionPath>
        {/* [수정] 텍스트 변경 및 클릭 시 초기화(resetFilters) 연결 */}
        <PathActiveLink onClick={resetFilters} style={{ cursor: "pointer" }}>
          {"남성 신발 전체"}
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

const ProductCardComponent = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const finalPrice =
    product.finalPrice ||
    Math.round(product.price * (1 - (product.discountRate || 0) / 100));
  const isSale = product.discountRate > 0;

  // 이미지 경로 처리: 서버 포트 3000번 명시
  const getImageUrl = (path) => {
    if (!path) return "/default_placeholder.webp";
    // 이미 http로 시작하는 절대 경로라면 그대로 사용
    if (path.startsWith("http")) return path;
    // 상대 경로라면 서버 주소(localhost:3000)를 붙여서 반환
    return `http://localhost:3000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const imageUrl = getImageUrl(
    product.images && product.images.length > 0 ? product.images[0] : null
  );
  const imageAlt = product.name;

  // 가용 사이즈 Set
  const availableStockSet = new Set(
    (product.availableSizes || []).map((size) => size.toString())
  );

  return (
    <ProductCard
      $isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/product/${product._id || product.id}`} // MongoDB _id 사용
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ImageWrapper>
          {isSale && <span className="sale-badge">SALE</span>}
          <img src={imageUrl} alt={imageAlt} />
        </ImageWrapper>

        <ProductInfoWrapper>
          <h4>{product.name}</h4>
          {/* categories는 배열이므로 join */}
          <h3>{product.categories ? product.categories.join(", ") : ""}</h3>
          <p className="price">
            {isSale && (
              <span className="original-price">
                {product.price.toLocaleString()}원
              </span>
            )}
            <span className="sale-price">{finalPrice.toLocaleString()}원</span>
          </p>
        </ProductInfoWrapper>
      </Link>

      {/* 호버 시 나타나는 사이즈 오버레이 */}
      {isHovered && (
        <div className="size-overlay">
          <div className="size-grid">
            {SERVER_FILTER_OPTIONS.sizes.map((sizeItem) => {
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
  const isMultiSelect = type === "sizes" || type === "materials";

  if (isMultiSelect) {
    const containerClass =
      type === "sizes" ? "sizes-container" : "material-list";
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
    // 단일 선택 버튼형 (현재 코드에선 사용되지 않을 수 있으나 유지)
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
// Main Component
// ------------------------------------------------

const ProductList = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState("newest");
  const [products, setProducts] = useState([]); // 서버에서 받아온 상품 목록
  const [loading, setLoading] = useState(false);

  // 1. 서버 API 호출 및 필터링 로직 (정렬은 제외)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // 쿼리 스트링 구성
      const params = new URLSearchParams();

      // (1) 카테고리/경로 필터 매핑
      // 클라이언트 필터 키 -> 서버 쿼리 파라미터 매핑
      if (activeFilters["lifestyle"]) params.append("category", "lifestyle");
      if (activeFilters["slip_on"]) params.append("category", "slipon"); // 서버 철자 주의: slipon
      if (activeFilters["new_products"]) params.append("isNew", "true");
      if (activeFilters["sale"]) params.append("onSale", "true");

      // (2) 소재 필터 (배열 -> 콤마 구분 문자열)
      if (activeFilters.materials && activeFilters.materials.length > 0) {
        params.append("materials", activeFilters.materials.join(","));
      }

      // (3) 사이즈 필터
      if (activeFilters.sizes && activeFilters.sizes.length > 0) {
        params.append("sizes", activeFilters.sizes.join(","));
      }

      // API 호출
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // 에러 처리 로직 (필요시 추가)
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  // 필터가 변경될 때마다 서버 요청
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2. 클라이언트 사이드 정렬 (서버에서 받아온 데이터를 프론트에서 정렬)
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      // 가격 계산 (Virtual fields가 없을 경우 대비)
      const getPrice = (p) =>
        p.finalPrice || Math.round(p.price * (1 - (p.discountRate || 0) / 100));

      switch (sortOption) {
        case "recommend": // [추천순 로직 수정] 세일 중 > 판매량 높음 우선
          const isSale = (p) => {
            // 서버에서 가상 필드 onSale을 보내주면 그것을 사용
            if (typeof p.onSale === "boolean") return p.onSale;

            // 아니면 클라이언트에서 계산 (할인율 > 0 그리고 기간 유효)
            const now = new Date();
            const start = p.saleStartDate ? new Date(p.saleStartDate) : null;
            const end = p.saleEndDate ? new Date(p.saleEndDate) : null;
            return (
              p.discountRate > 0 &&
              (!start || start <= now) &&
              (!end || end >= now)
            );
          };

          const saleA = isSale(a);
          const saleB = isSale(b);

          // 1. 세일 여부 (세일 중인 상품이 앞으로)
          if (saleA && !saleB) return -1;
          if (!saleA && saleB) return 1;

          // 2. 판매량 내림차순
          return (b.salesCount || 0) - (a.salesCount || 0);

        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "price_low":
          return getPrice(a) - getPrice(b);
        case "price_high":
          return getPrice(b) - getPrice(a);
        case "sales_high":
          return (b.salesCount || 0) - (a.salesCount || 0); // salesCount 사용
        default:
          return 0;
      }
    });
    return sorted;
  }, [products, sortOption]);

  // 필터 토글 핸들러
  const toggleFilter = useCallback((key, value) => {
    if (key === "sizes" || key === "materials") {
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
    } else {
      setActiveFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        const isCurrentlyActive = newFilters[key];

        if (PATH_CHILD_FILTER_KEYS.includes(key)) {
          PATH_CHILD_FILTER_KEYS.forEach((filterKey) => {
            delete newFilters[filterKey];
          });
          if (!isCurrentlyActive) {
            newFilters[key] = true;
          }
        } else {
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

  const handlePathChildFilter = toggleFilter;

  const resetFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  // 적용된 필터 표시 로직
  const appliedFilters = useMemo(() => {
    const filters = [];
    const materialMap = Object.fromEntries(
      SERVER_FILTER_OPTIONS.materials.map((m) => [m.value, m.label])
    );

    // 카테고리 필터 태그 표시 제거 (요청사항 반영 유지)
    // 사이즈와 소재 필터만 필터 항목에 표시

    (activeFilters.sizes || []).forEach((size) => {
      filters.push({
        key: "sizes",
        value: `${size}mm`,
        rawValue: size,
        type: "sizes",
      });
    });

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
        <h1>남성 신발</h1>
      </TitleBar>

      <CollectionMenu
        handlePathChildFilter={handlePathChildFilter}
        activeFilters={activeFilters}
        resetFilters={resetFilters}
      />

      <Layout>
        <FilterSidebar>
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
                      toggleFilter(filter.key, filter.rawValue);
                    } else {
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
            options={SERVER_FILTER_OPTIONS.sizes}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
          />

          <FilterComponent
            title="소재"
            type="materials"
            options={SERVER_FILTER_OPTIONS.materials}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
          />
        </FilterSidebar>

        <ProductGrid>
          <header>
            <span>{sortedProducts.length}개 제품</span>
            <SortSelect
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {SERVER_FILTER_OPTIONS.sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SortSelect>
          </header>

          <Grid>
            {loading ? (
              <p>상품을 불러오는 중입니다...</p>
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <ProductCardComponent
                  key={product._id || product.id}
                  product={product}
                />
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
