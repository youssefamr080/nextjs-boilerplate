'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { giftOptions } from '../../data/products';
import { useGift } from '../../context/GiftContext';

const GiftStepBox = () => {
  const { state, dispatch } = useGift();

  // فلترة الخيارات الخاصة بالصناديق
  const boxes = giftOptions.filter(item => item.category === 'boxes');

  // معالجة اختيار أو إزالة الصندوق
  const handleSelectBox = (box) => {
    if (state.selectedBox?.id === box.id) {
      // إذا كان الصندوق محددًا بالفعل، قم بإزالته
      dispatch({ type: 'SELECT_BOX', payload: null });
    } else {
      // إذا لم يكن محددًا، قم باختياره
      dispatch({ type: 'SELECT_BOX', payload: box });
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      {/* العنوان */}
      <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-4 text-center">
        اختر صندوق الهدية 🎁
      </h3>

      {/* عرض الخيارات باستخدام Swiper */}
      {boxes.length > 0 ? (
        <Swiper
          spaceBetween={15}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 2.2 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5 },
          }}
          className="mb-6"
        >
          {boxes.map((box) => (
            <SwiperSlide key={box.id}>
              <div
                onClick={() => handleSelectBox(box)}
                className={`relative bg-blue-50 p-3 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                  state.selectedBox?.id === box.id
                    ? 'border-blue-600 shadow-lg'
                    : 'border-transparent hover:border-blue-300'
                }`}
              >
                {/* أيقونة الإزالة عند التحديد */}
                {state.selectedBox?.id === box.id && (
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

                {/* صورة الصندوق */}
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-full h-24 object-contain mb-2"
                />

                {/* اسم الصندوق */}
                <h4 className="font-semibold text-gray-800 text-sm truncate">
                  {box.name}
                </h4>

                {/* السعر */}
                <p className="text-blue-600 font-medium text-xs">
                  {box.price.toLocaleString()} ج.م
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // حالة عدم وجود خيارات صناديق
        <div className="text-center py-4 text-gray-500 text-sm">
          لا توجد صناديق متاحة حاليًا
        </div>
      )}
    </div>
  );
};

export default GiftStepBox;