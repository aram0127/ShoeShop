// mockData.js

export const mockProducts = [
  // --- 라이프스타일 (Lifestyle) 11개 ---
  {
    id: 101,
    name: "울 러너 클래식",
    category: ["라이프스타일", "베스트"],
    price: 150000,
    salePrice: 150000,
    sizes: [250, 260, 270, 280, 290],
    material: "울",
    sales: 120,
    imageUrls: [
      { url: "/images/9.webp", alt: "울 러너 클래식 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-11-20T09:00:00Z",
  },
  {
    id: 102,
    name: "트리 러너 경량",
    category: ["라이프스타일", "세일"],
    price: 130000,
    salePrice: 91000,
    sizes: [250, 255, 270, 280, 290],
    material: "나무 섬유",
    sales: 85,
    imageUrls: [
      { url: "/images/2.webp", alt: "트리 러너 경량 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-10-15T10:00:00Z",
  },
  {
    id: 104,
    name: "크루저 미드 블랙",
    category: ["라이프스타일", "신제품"],
    price: 180000,
    salePrice: 180000,
    sizes: [260, 270, 280, 290, 300],
    material: "울",
    sales: 60,
    imageUrls: [
      { url: "/images/2.webp", alt: "크루저 미드 블랙 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-09-01T12:00:00Z",
  },
  {
    id: 106,
    name: "트리 대시 하이커",
    category: ["라이프스타일"],
    price: 140000,
    salePrice: 140000,
    sizes: [270, 275, 290, 310],
    material: "나무 섬유",
    sales: 90,
    imageUrls: [
      { url: "/images/9.webp", alt: "트리 대시 하이커 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-08-05T14:00:00Z",
  },
  {
    id: 107,
    name: "캔버스 워커 화이트",
    category: ["라이프스타일", "세일"],
    price: 90000,
    salePrice: 72000,
    sizes: [250, 260, 270, 280, 290],
    material: "캔버스",
    sales: 150,
    imageUrls: [
      { url: "/images/2.webp", alt: "캔버스 워커 화이트 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-07-25T15:00:00Z",
  },
  {
    id: 108,
    name: "캔버스 워커 네이비",
    category: ["라이프스타일"],
    price: 90000,
    salePrice: 90000,
    sizes: [255, 265, 275, 285],
    material: "캔버스",
    sales: 110,
    imageUrls: [
      { url: "/images/9.webp", alt: "캔버스 워커 네이비 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-06-15T16:00:00Z",
  },
  {
    id: 109,
    name: "면 컴포트 슈즈",
    category: ["라이프스타일"],
    price: 110000,
    salePrice: 110000,
    sizes: [260, 270, 280],
    material: "면",
    sales: 75,
    imageUrls: [
      { url: "/images/2.webp", alt: "면 컴포트 슈즈 베이지 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-05-10T17:00:00Z",
  },
  {
    id: 110,
    name: "울 러너 리미티드",
    category: ["라이프스타일", "베스트"],
    price: 220000,
    salePrice: 220000,
    sizes: [250, 260, 270, 280],
    material: "울",
    sales: 30,
    imageUrls: [
      { url: "/images/2.webp", alt: "울 러너 리미티드 에디션 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-04-20T18:00:00Z",
  },
  {
    id: 111,
    name: "트리 대시 스피드",
    category: ["라이프스타일"],
    price: 150000,
    salePrice: 150000,
    sizes: [260, 270, 280, 290],
    material: "나무 섬유",
    sales: 55,
    imageUrls: [
      { url: "/images/9.webp", alt: "트리 대시 스피드 화이트 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-03-01T19:00:00Z",
  },
  {
    id: 112,
    name: "면 에어 슈즈",
    category: ["라이프스타일", "신제품"],
    price: 160000,
    salePrice: 160000,
    sizes: [260, 270, 280, 290, 300],
    material: "면",
    sales: 15,
    imageUrls: [
      { url: "/images/9.webp", alt: "면 에어 슈즈 블루 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-11-25T20:00:00Z",
  },
  {
    id: 113,
    name: "울 러너 여성용",
    category: ["라이프스타일"],
    price: 150000,
    salePrice: 150000,
    sizes: [230, 235, 240, 245, 250],
    material: "울",
    sales: 40,
    imageUrls: [
      { url: "/images/3.webp", alt: "여성용 울 러너 핑크 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-11-26T21:00:00Z",
  },

  // --- 슬립온 (Slip-On) 11개 ---
  {
    id: 103,
    name: "스위트 폼 슬립온 핑크",
    category: ["슬립온", "신제품"],
    price: 100000,
    salePrice: 100000,
    sizes: [250, 260, 270, 280],
    material: "사탕수수",
    sales: 25,
    imageUrls: [
      { url: "/images/9.webp", alt: "스위트 폼 슬립온 핑크 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-11-24T11:00:00Z",
  },
  {
    id: 105,
    name: "울 크루저 슬립온 그레이",
    category: ["슬립온", "세일"],
    price: 160000,
    salePrice: 112000,
    sizes: [250, 260, 270, 280, 290],
    material: "울",
    sales: 45,
    imageUrls: [
      { url: "/images/2.webp", alt: "울 크루저 슬립온 그레이 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-10-28T13:00:00Z",
  },
  {
    id: 114,
    name: "트리 슬립온 베이직",
    category: ["슬립온"],
    price: 120000,
    salePrice: 120000,
    sizes: [250, 260, 270, 280, 290],
    material: "나무 섬유",
    sales: 70,
    imageUrls: [
      { url: "/images/2.webp", alt: "트리 슬립온 베이직 블루 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-09-15T10:00:00Z",
  },
  {
    id: 115,
    name: "캔버스 슬립온 클래식",
    category: ["슬립온", "베스트"],
    price: 80000,
    salePrice: 80000,
    sizes: [250, 260, 270, 280, 290, 300],
    material: "캔버스",
    sales: 200,
    imageUrls: [
      { url: "/images/3.webp", alt: "캔버스 슬립온 클래식 블랙 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-08-01T12:00:00Z",
  },
  {
    id: 116,
    name: "면 스트라이프 슬립온",
    category: ["슬립온", "세일"],
    price: 100000,
    salePrice: 80000,
    sizes: [260, 270, 280],
    material: "면",
    sales: 50,
    imageUrls: [
      { url: "/images/3.webp", alt: "면 스트라이프 슬립온 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-07-07T14:00:00Z",
  },
  {
    id: 117,
    name: "울 슬립온 퓨어",
    category: ["슬립온"],
    price: 170000,
    salePrice: 170000,
    sizes: [255, 265, 275, 285],
    material: "울",
    sales: 35,
    imageUrls: [
      { url: "/images/3.webp", alt: "울 슬립온 퓨어 화이트 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-06-20T16:00:00Z",
  },
  {
    id: 118,
    name: "캔버스 슬립온 키즈",
    category: ["슬립온"],
    price: 60000,
    salePrice: 60000,
    sizes: [180, 190, 200, 210, 220],
    material: "캔버스",
    sales: 95,
    imageUrls: [
      { url: "/images/2.webp", alt: "캔버스 슬립온 키즈용 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-05-05T18:00:00Z",
  },
  {
    id: 119,
    name: "사탕수수 폼 슬립온 블루",
    category: ["슬립온", "신제품"],
    price: 110000,
    salePrice: 110000,
    sizes: [260, 270, 280, 290],
    material: "사탕수수",
    sales: 10,
    imageUrls: [
      { url: "/images/2.webp", alt: "사탕수수 폼 슬립온 블루 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-11-28T22:00:00Z",
  },
  {
    id: 120,
    name: "트리 슬립온 라이트",
    category: ["슬립온"],
    price: 130000,
    salePrice: 130000,
    sizes: [250, 260, 270, 280, 290],
    material: "나무 섬유",
    sales: 65,
    imageUrls: [
      { url: "/images/2.webp", alt: "트리 슬립온 라이트 옐로우 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-04-10T23:00:00Z",
  },
  {
    id: 121,
    name: "면 클래식 슬립온",
    category: ["슬립온"],
    price: 95000,
    salePrice: 95000,
    sizes: [260, 270, 280, 290],
    material: "면",
    sales: 80,
    imageUrls: [
      { url: "/images/2.webp", alt: "면 클래식 슬립온 레드 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-03-20T00:00:00Z",
  },
  {
    id: 122,
    name: "울 크루저 슬립온 브라운",
    category: ["슬립온"],
    price: 160000,
    salePrice: 160000,
    sizes: [250, 260, 270, 280],
    material: "울",
    sales: 28,
    imageUrls: [
      { url: "/images/2.webp", alt: "울 크루저 슬립온 브라운 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-02-14T01:00:00Z",
  },
  // --- 새로운 제품 등록 시연용 ---
  {
    id: 999,
    name: "신규 등록 테스트 슈즈",
    category: ["라이프스타일", "신제품"],
    price: 199000,
    salePrice: 199000,
    sizes: [260, 270, 280],
    material: "울",
    sales: 0,
    imageUrls: [
      { url: "/images/2.webp", alt: "신규 제품 테스트 (단일 이미지)" }, // 단일 이미지로 통일
    ],
    registeredAt: "2025-11-29T08:33:00Z",
  },
];

export const mockOrders = [
  // ... (mockOrders는 생략)
];

export const mockFilters = {
  categories: [
    { value: "new_products", label: "신제품" },
    { value: "lifestyle", label: "라이프스타일" },
    { value: "sale", label: "세일" },
    { value: "slipon", label: "슬립온" }, // <-- 'slip_on'을 'slipon'으로 수정
  ],
  sizes: [
    250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320,
  ].map((size) => ({ value: size.toString(), label: size.toString() })),
  material: [
    // <-- value를 서버 DB enum 값으로 모두 수정
    { value: "tree", label: "가볍고 시원한 Tree" },
    { value: "cotton", label: "면" },
    { value: "wool", label: "부드럽고 따뜻한 Wool" },
    { value: "canvas", label: "캔버스" },
    { value: "leather", label: "플라스틱 제로 식물성 가죽" },
  ],
  sortOptions: [
    { value: "recommend", label: "추천순" },
    { value: "sales_high", label: "판매순" },
    { value: "price_low", label: "가격 낮은순" },
    { value: "price_high", label: "가격 높은순" },
    { value: "newest", label: "최신 등록순" },
  ],
};
