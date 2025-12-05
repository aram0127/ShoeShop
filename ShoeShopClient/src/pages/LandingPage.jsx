// src/LandingPage.js

import React from "react";
// import Header from './Header';  // 👈 삭제
import ImageSlider from "../components/home/ImageSlider";
// import Footer from './Footer'; // 👈 삭제
import {
  LandingPageMain,
  // Section,
  GridContainer,
  GridItem,
  // Banner,
} from "./LandingPage.styled";

// ... promoItems 데이터는 그대로 둡니다.

const LandingPage = () => {
  return (
    <LandingPageMain>
      {/* <Header /> 👈 삭제 */}
      <ImageSlider />

      {/* <Footer /> 👈 삭제 */}
    </LandingPageMain>
  );
};

export default LandingPage;
