import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import Navbar from "./Navbar";
import WishlistDrawer from "./WishlistDrawer";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import SearchBar from "../search/SearchBar"; // ✅ استدعاء مكون البحث

const Header = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      {/* ✅ سطح المكتب (صف واحد) */}
      <div className="hidden md:flex items-center justify-between container mx-auto px-6 h-20">
        {/* 🔹 اللوجو */}
        <Link href="/" className="transition-transform duration-300 hover:scale-105">
          <Image src="/logo.png" alt="Cadoz Logo" width={140} height={50} priority />
        </Link>

        {/* ✅ استبدال البحث المكتوب يدويًا بمكون `SearchBar` */}
        <SearchBar />
        <Navbar />
        {/* 🔹 أيقونات المفضلة والسلة */}
        <div className="flex items-center space-x-6">
          <button onClick={() => setIsWishlistOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Heart className="h-7 w-7 text-red-600" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <ShoppingBag className="h-7 w-7 text-yellow-500" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ✅ الهاتف (صفين) */}
      <div className="md:hidden px-4 py-3">
        {/* 🔹 الصف الأول: الأيقونات + اللوجو */}
        <div className="flex items-center justify-between">
          <Link href="/cart" className="relative p-2">
            <ShoppingBag className="h-8 w-8 text-yellow-500" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          <Link href="/" className="transition-transform duration-300 hover:scale-105">
            <Image src="/logo.png" alt="Cadoz Logo" width={120} height={40} priority />
          </Link>

          <button onClick={() => setIsWishlistOpen(true)} className="relative p-2">
            <Heart className="h-8 w-8 text-red-600" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
        </div>

        {/* 🔹 الصف الثاني: شريط البحث + القائمة */}
        <div className="mt-3 flex items-center space-x-2">
          <Navbar />
          <SearchBar /> {/* ✅ استخدام مكون البحث بدلًا من كتابته يدويًا */}
        </div>
      </div>

      {/* ✅ نافذة المفضلة الجانبية */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </header>
  );
};

export default Header;
