"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const banners = {
  men: [
    {
      image: "/images/potrait slider.jpg",
      url: "/men-collection",
      title: "مجموعة رجال ٢٠٢٤"
    },
    {
      image: "/images/walet slider.jpg",
      url: "/wallets",
      title: "محافظ فاخرة"
    },
    // ... أضف بقية الصور مع روابطها
  ],
  // نفس الهيكل للفئات الأخرى
};

const CategoryBanner = ({ category }: { category: string }) => {
  const currentBanners = banners[category as keyof typeof banners] || [{
    image: "/images/default-banner.jpg",
    url: "/",
    title: "المجموعة المميزة"
  }];

  return (
    <div className="w-full relative rounded-lg overflow-hidden shadow-md">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
          bulletActiveClass: '!bg-rose-600'
        }}
        loop={true}
        speed={500}
        className="h-[250px] md:h-[350px]"
      >
        {currentBanners.map((banner, index) => (
          <SwiperSlide key={index}>
            <Link href={banner.url} className="block relative h-full w-full">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-4">
                <h3 className="text-white text-lg font-semibold">
                  {banner.title}
                </h3>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryBanner;