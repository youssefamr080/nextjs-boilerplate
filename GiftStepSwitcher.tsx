'use client';
import React, { useState, useCallback } from 'react';
import GiftStepChocolates from './GiftStepChocolates';
import GiftStepCandies from './GiftStepCandies';
import GiftStepBox from './GiftStepBox';
import GiftStepDecorations from './GiftStepDecorations';
import GiftStepWrap from './GiftStepWrap';
import GiftSummary from './GiftSummary';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

type GiftStep = 'chocolates' | 'candies' | 'box' | 'decorations' | 'wrap' | 'summary';

const stepsOrder: GiftStep[] = [
  'chocolates',
  'candies',
  'box',
  'decorations',
  'wrap',
  'summary',
];

const stepTitles: { [key in GiftStep]: string } = {
  chocolates: 'اختيار الشوكولاتة',
  candies: 'اختيار الحلويات',
  box: 'اختيار الصندوق',
  decorations: 'اختيار الزينة',
  wrap: 'اختيار التغليف',
  summary: 'ملخص الهدية',
};

const GiftStepSwitcher = () => {
  const [currentStep, setCurrentStep] = useState<GiftStep>(stepsOrder[0]);

  // التنقل بين الخطوات
  const navigate = useCallback((direction: 'next' | 'prev') => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= stepsOrder.length) {
      newIndex = stepsOrder.length - 1;
    }
    setCurrentStep(stepsOrder[newIndex]);
  }, [currentStep]);

  // عرض الخطوة الحالية
  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 'chocolates':
        return <GiftStepChocolates />;
      case 'candies':
        return <GiftStepCandies />;
      case 'box':
        return <GiftStepBox />;
      case 'decorations':
        return <GiftStepDecorations />;
      case 'wrap':
        return <GiftStepWrap />;
      case 'summary':
        return <GiftSummary />;
      default:
        return <div>خطوة غير معروفة</div>;
    }
  }, [currentStep]);

  return (
    <motion.div
      className="bg-white p-3 rounded-lg shadow-md overflow-hidden flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* العنوان */}
      <header className="px-2 py-3 sm:px-4">
        <h3 className="text-sm font-semibold text-gray-900 text-center md:text-base">
          {stepTitles[currentStep]}
        </h3>
        <p className="mt-1 text-[10px] text-gray-500 text-center md:text-xs">
          أكمل الخطوات لتصميم هديتك المثالية.
        </p>
      </header>

      {/* محتوى الخطوة */}
      <div className="flex-grow overflow-y-auto">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </div>

      {/* شريط التقدم */}
      <nav aria-label="Progress" className="mt-4">
        <ol className="flex items-center justify-between">
          {stepsOrder.map((step, index) => (
            <li key={step} className="relative flex-1">
              {index < stepsOrder.indexOf(currentStep) ? (
                <span className="flex items-center justify-center w-6 h-6 mx-auto bg-rose-600 rounded-full">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              ) : index === stepsOrder.indexOf(currentStep) ? (
                <span className="flex items-center justify-center w-6 h-6 mx-auto border-2 border-rose-600 rounded-full">
                  <span className="text-xs font-medium text-rose-600">{index + 1}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center w-6 h-6 mx-auto border-2 border-gray-300 rounded-full">
                  <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* أزرار التنقل */}
      <div className="mt-4 flex justify-between items-center px-2">
        {/* زر التالي (على اليسار) */}
        <button
          onClick={() => navigate('next')}
          disabled={stepsOrder.indexOf(currentStep) === stepsOrder.length - 1}
          className="flex items-center justify-center bg-rose-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          التالي
          <ChevronRightIcon className="w-4 h-4 ml-1" />
        </button>

        {/* زر السابق (على اليمين) */}
        <button
          onClick={() => navigate('prev')}
          disabled={stepsOrder.indexOf(currentStep) === 0}
          className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-xs font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          السابق
        </button>
      </div>
    </motion.div>
  );
};

export default GiftStepSwitcher;