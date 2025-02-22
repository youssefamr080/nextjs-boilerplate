'use client';

import React, { useEffect, useState } from 'react';
import { useGift } from '../../context/GiftContext';
import { XMarkIcon, PlusIcon, MinusIcon, GiftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';

const GiftContainer = () => {
  const { state, dispatch } = useGift();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const cart = state?.cart || [];
  const uniqueItemsCount = cart.length;

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    toast.success('تم حذف العنصر بنجاح!');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
    }
  };

  return (
    <motion.div
      className="relative bg-white p-4 rounded-2xl shadow-xl border-2 border-rose-100 min-h-[300px]"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* عداد الأصناف */}
      <motion.div
        className="absolute -top-3 -right-3 bg-rose-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10"
        key={uniqueItemsCount}
      >
        <span className="text-sm font-bold">{uniqueItemsCount}</span>
      </motion.div>

      {/* المحتوى الرئيسي */}
      <div className="pt-8">
        <h2 className="text-center text-rose-700 font-bold text-xl mb-6">
          صندوق الهدايا
          <span className="block w-12 h-1 bg-rose-300 mx-auto mt-2 rounded-full" />
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-rose-500/80 text-sm mb-2">لا توجد عناصر في الصندوق</p>
            <div className="inline-block p-4 bg-rose-50 rounded-full">
              <GiftIcon className="w-12 h-12 text-rose-400/60" />
            </div>
          </div>
        ) : (
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={16}
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="!pb-8"
          >
            {cart.map((item) => (
              <SwiperSlide 
                key={item.id} 
                className="!w-[180px] !h-[220px] transform transition-transform hover:scale-95"
              >
                <motion.div
                  className="relative h-full bg-white rounded-xl shadow-lg p-3 border border-rose-50 flex flex-col"
                  whileHover={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 z-10 p-1 bg-rose-100/80 rounded-full backdrop-blur-sm"
                  >
                    <XMarkIcon className="w-4 h-4 text-rose-600" />
                  </button>

                  <div className="flex-1 mb-3 relative">
                    {item.data?.image && (
                      <Image
                        src={item.data.image}
                        alt={item.data.name}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 180px)"
                      />
                    )}
                  </div>

                  <div className="text-center"></div>

                  <div className="text-center">
                    <h3 className="text-xs font-semibold text-rose-900 mb-1 truncate">
                      {item.data.name}
                    </h3>
                    <p className="text-[10px] text-rose-500 mb-2">
                      {item.data.price.toLocaleString()} ج.م
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      className={`p-1 rounded-full ${
                        item.quantity > 1
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <MinusIcon className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-rose-600 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-rose-100 text-rose-600 rounded-full"
                    >
                      <PlusIcon className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </motion.div>
  );
};

export default GiftContainer;