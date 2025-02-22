"use client";

import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import type { SwiperOptions } from "swiper/types";

type CategoryType = "men" | "women" | "kids";

interface SubCategory {
  name: string;
  image: string;
}

interface SubCategorySwiperProps {
  category: CategoryType;
  onSelectSubCategory: (subCategory: string) => void;
}

const SUB_CATEGORIES: Record<CategoryType, SubCategory[]> = {
  men: [
    { name: "ساعات", image: "/images/watch section.png" },
    { name: "محافظ", image: "/images/men wallet.png" },
    { name: "عطور", image: "/images/men perfum section.png" },
    { name: "شنط يد", image: "/images/hand bag.png" },
    { name: "نظارات شمسية", image: "/images/men sunglasses.png" },
  ],
  women: [
    { name: "ساعات", image: "/images/women watch.png" },
    { name: "محافظ", image: "/images/walet-women.webp" },
    { name: "عطور", image: "/images/women perfume.png" },
    { name: "إكسسوارات", image: "/images/women Accessories.png" },
    { name: "نظارات شمسية", image: "/images/women sunglasses.png" },
  ],
  kids: [
    { name: "ألعاب أطفال", image: "/images/kids toys.png" },
    { name: "دباديب", image: "/images/kids fur.png" },
    { name: "ساعات أطفال", image: "/images/kids watch.png" },
  ],
};

const swiperConfig: SwiperOptions = {
  spaceBetween: 16,
  slidesPerView: 4,
  autoplay: {
    delay: 6000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  breakpoints: {
    320: { slidesPerView: 3 },
    640: { slidesPerView: 4 },
    768: { slidesPerView: 5 },
    1024: { slidesPerView: 6, spaceBetween: 24 },
  },
  loop: true,
  modules: [Autoplay],
};

const SubCategoryItem = ({
  sub,
  onClick,
}: {
  sub: SubCategory;
  onClick: () => void;
}) => (
  <div
    role="button"
    tabIndex={0}
    aria-label={`اختر تصنيف ${sub.name}`}
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    className="group flex flex-col items-center cursor-pointer transition-all hover:scale-105 active:scale-95"
  >
    <div className="relative w-20 h-20 rounded-full shadow-lg border-2 border-gray-100 overflow-hidden transition-all duration-300 group-hover:border-primary-500 group-hover:shadow-xl">
      <Image
        src={sub.image}
        alt={sub.name}
        width={96}
        height={96}
        className="object-cover w-full h-full"
        loading="lazy"
        quality={85}
        sizes="(max-width: 768px) 96px, 128px"
      />
    </div>
    <p className="mt-3 text-sm font-medium text-gray-800 text-center leading-tight transition-colors group-hover:text-primary-600">
      {sub.name}
    </p>
  </div>
);

const SubCategorySwiper = ({
  category,
  onSelectSubCategory,
}: SubCategorySwiperProps) => {
  const categories = useMemo(
    () => SUB_CATEGORIES[category] || [],
    [category]
  );

  if (!categories.length) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <Swiper {...swiperConfig} className="!pb-2">
        {categories.map((sub, index) => (
          <SwiperSlide key={`${sub.name}-${index}`}>
            <SubCategoryItem
              sub={sub}
              onClick={() => onSelectSubCategory(sub.name)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SubCategorySwiper;