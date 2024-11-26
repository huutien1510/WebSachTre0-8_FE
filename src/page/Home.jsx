import BookSlider from "../Components/BookSlider/BookSlider";
import HeroSection from "../Components/HeroSection/HeroSection";
import Slider from "../Components/Slider/Slider";
import { useLayoutEffect } from "react";

function Home() {
  useLayoutEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
  }, []);
  return (
    <div>
      <Slider />
      <BookSlider />
      <HeroSection />
    </div>
  );
}

export default Home;
