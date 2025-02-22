'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { giftOptions } from '../../data/products';
import { useGift } from '../../context/GiftContext';

const GiftStepWrap = () => {
  const { state, dispatch } = useGift();

  // فلترة الخيارات الخاصة بالتغليف
  const wraps = giftOptions.filter(item => item.category === 'packets');

  // معالجة اختيار أو إزالة التغليف
  const handleSelectWrap = (wrap) => {
    if (state.selectedWrap?.id === wrap.id) {
      // إذا كان التغليف محددًا بالفعل، قم بإزالته
      dispatch({ type: 'SELECT_WRAP', payload: null });
    } else {
      // إذا لم يكن محددًا، قم باختياره
      dispatch({ type: 'SELECT_WRAP', payload: wrap });
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      {/* العنوان */}
      <h3 className="text-lg md:text-xl font-bold text-pink-600 mb-4 text-center">
        اختر الباكت 🎀
      </h3>

      {/* عرض الخيارات باستخدام Swiper */}
      {wraps.length > 0 ? (
        <Swiper
          spaceBetween={15}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 2.2 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="mb-6"
        >
          {wraps.map((wrap) => (
            <SwiperSlide key={wrap.id}>
              <div
                onClick={() => handleSelectWrap(wrap)}
                className={`relative bg-pink-50 p-3 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                  state.selectedWrap?.id === wrap.id
                    ? 'border-pink-600 shadow-lg'
                    : 'border-transparent hover:border-pink-300'
                }`}
              >
                {/* أيقونة الإزالة عند التحديد */}
                {state.selectedWrap?.id === wrap.id && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}

                {/* صورة التغليف */}
                <img
                  src={wrap.image}
                  alt={wrap.name}
                  className="w-full h-24 object-contain mb-2"
                />

                {/* اسم التغليف */}
                <h4 className="font-semibold text-gray-800 text-sm truncate">
                  {wrap.name}
                </h4>

                {/* السعر */}
                <p className="text-pink-600 font-medium text-xs">
                  {wrap.price.toLocaleString()} ج.م
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // حالة عدم وجود خيارات تغليف
        <div className="text-center py-4 text-gray-500 text-sm">
          لا توجد خيارات تغليف متاحة حالياً
        </div>
      )}
    </div>
  );
};

export default GiftStepWrap;