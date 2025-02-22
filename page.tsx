import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#4A3228] py-12 px-6">
      {/* اسم المتجر */}
      <h1 className="text-5xl font-bold text-[#8B4513] drop-shadow-lg mb-8">
        🎁 Cadoz 🎁
      </h1>

      {/* وصف قصير */}
      <p className="text-lg text-center max-w-lg text-[#5C3D2E] italic tracking-wide">
        ✨ اكتشفوا عالم الهدايا الفاخرة، حيث كل قطعة تحمل بصمة فريدة من الجمال والتميز. ✨
      </p>

      {/* الأقسام الرئيسية */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-center gap-8 mt-10">
        {/* قسم الرجال */}
        <Link href="/category/men" className="w-full md:w-1/3">
          <div className="relative rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300 border border-[#8B4513] bg-white">
            <Image
              src="/images/men.png"
              alt="قسم الرجال"
              width={400}
              height={400}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 w-full p-4 bg-[#8B4513] text-white text-center font-semibold text-lg">
              رجالي
            </div>
          </div>
        </Link>

        {/* قسم النساء */}
        <Link href="/category/women" className="w-full md:w-1/3">
          <div className="relative rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300 border border-[#D2B48C] bg-white">
            <Image
              src="/images/women.png"
              alt="قسم النساء"
              width={400}
              height={400}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 w-full p-4 bg-[#D2B48C] text-white text-center font-semibold text-lg">
              حريمي
            </div>
          </div>
        </Link>

        {/* قسم الأطفال */}
        <Link href="/category/kids" className="w-full md:w-1/3">
          <div className="relative rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300 border border-[#FFD700] bg-white">
            <Image
              src="/images/kids.WEBP"
              alt="قسم الأطفال"
              width={400}
              height={400}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 w-full p-4 bg-[#FFD700] text-white text-center font-semibold text-lg">
              أطفال
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
