"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

const loginSliderImages = [
  "/images/about-slider/1.webp",
  "/images/about-slider/2.webp",
  "/images/about-slider/3.webp",
  "/images/about-slider/4.webp",
];

const AUTOPLAY_DELAY = 2000;
const SLIDES_PER_VIEW = 1;

export default function AboutSlider() {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{
        delay: AUTOPLAY_DELAY,
        disableOnInteraction: true,
      }}
      scrollbar={{ draggable: true }}
      slidesPerView={SLIDES_PER_VIEW}
      loop
      className="h-full max-w-full"
    >
      {loginSliderImages.map((image, index) => (
        <SwiperSlide key={index} className="relative">
          <Image
            src={image}
            alt="Login Slider"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            fill
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
