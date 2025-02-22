'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { giftOptions } from '../../data/products';
import { useGift } from '../../context/GiftContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const GiftStepChocolates = () => {
  const { dispatch } = useGift();
  const chocolates = giftOptions.filter(item => item.category === 'chocolates').sort((a, b) => a.tags[0].localeCompare(b.tags[0]));

  const addToCart = (chocolate) => {
    dispatch({ type: 'ADD_TO_CART', payload: chocolate });
    toast.success(`${chocolate.name} أضيفت إلى هديتك!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const chocolateChunks = chunkArray(chocolates, 10);

  return (
    <motion.div
      className="bg-white p-4 md:p-6 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl md:text-2xl font-bold text-rose-600 mb-4 md:mb-6 text-center">
        اختر الشوكولاتة المفضلة 🍫
      </h3>

      {chocolateChunks.length > 0 ? (
        chocolateChunks.map((chunk, index) => (
          <Swiper
            key={index}
            spaceBetween={15}
            slidesPerView="auto"
            breakpoints={{
              320: { slidesPerView: 2.2 },
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3.5 },
              1280: { slidesPerView: 4.5 },
            }}
            className="mb-6"
          >
            {chunk.map(chocolate => (
              <SwiperSlide key={chocolate.id}>
                <motion.div
                  className="bg-rose-50 p-3 md:p-4 rounded-lg hover:shadow-md transition-shadow duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <img
                    src={chocolate.image}
                    alt={chocolate.name}
                    className="w-full h-24 md:h-32 object-contain mb-3"
                  />
                  <h4 className="font-semibold text-gray-800 text-sm md:text-md truncate">{chocolate.name}</h4>
                  <p className="text-rose-600 font-medium text-xs md:text-sm">
                    {chocolate.price.toLocaleString()} ج.م
                  </p>
                  <button
                    onClick={() => addToCart(chocolate)}
                    className="mt-2 w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition-colors duration-300 text-xs md:text-sm"
                  >
                    إضافة إلى الهدية
                  </button>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          لا توجد شوكولاتة متاحة حاليًا
        </div>
      )}
    </motion.div>
  );
};

export default GiftStepChocolates;