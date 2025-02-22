"use client";

import React from "react";
import { useGift } from "../../context/GiftContext";
import { useCart } from "../../context/CartContext";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GiftSummary = () => {
  const { state } = useGift();
  const { cart, updateQuantity, removeFromCart } = useCart();

  // 🧮 **حساب الإجمالي النهائي**
  const calculateTotal = () => {
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const giftTotal = state.cart.reduce((sum, item) => sum + item.data.price * item.quantity, 0);
    const boxPrice = state.selectedBox?.price || 0;
    const wrapPrice = state.selectedWrap?.price || 0;
    return cartTotal + giftTotal + boxPrice + wrapPrice;
  };

  // 📲 **إنشاء رسالة الطلب عبر واتساب**
  const createWhatsappOrder = () => {
    const cartItemsList = cart
      .map(
        (item) =>
          `📌 *[ID: ${item.id}]* ${item.name} ×${item.quantity} = ${item.price * item.quantity} ج.م`
      )
      .join("\n");

    const giftItemsList = state.cart
      .map(
        (item) =>
          `🎁 *[ID: ${item.id}]* ${item.data.name} ×${item.quantity} = ${
            item.data.price * item.quantity
          } ج.م`
      )
      .join("\n");

    const boxText = state.selectedBox
      ? `🪄 صندوق الهدية: *${state.selectedBox.name}* - ${state.selectedBox.price} ج.م`
      : "";

    const wrapText = state.selectedWrap
      ? `🎀 التغليف: *${state.selectedWrap.name}* - ${state.selectedWrap.price} ج.م`
      : "";

    const message = `
      🚀 *طلب جديد من Cadoz!*\n
      📦 *المنتجات الأساسية:*\n${cartItemsList || "لا توجد منتجات أساسية"}\n
      🎁 *محتويات الهدية:*\n${giftItemsList || "لم يتم إضافة هدايا"}\n
      ${boxText ? boxText + "\n" : ""}
      ${wrapText ? wrapText + "\n" : ""}
      💰 *الإجمالي:* ${calculateTotal().toLocaleString()} ج.م\n
      ✅ شكراً لاختيارك *Cadoz!* 🎀
    `;

    return `https://wa.me/+201026972523?text=${encodeURIComponent(message)}`;
  };

  const handleUpdateQuantity = (id, amount) => {
    updateQuantity(id, amount);
    toast.success("تم تحديث الكمية بنجاح!");
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    toast.error("تم إزالة المنتج من السلة!");
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-lg max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ToastContainer />
      <h2 className="text-2xl md:text-3xl font-bold text-emerald-600 mb-6 text-center">
        مراجعة الطلب النهائي 🛒
      </h2>

      {/* 🔹 المنتجات الأساسية */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">📦 المنتجات الأساسية</h3>
        {cart.length > 0 ? (
          cart.map((item) => (
            <motion.div
              key={item.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-3"
            >
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-lg" />
                <div>
                  <h3 className="text-md font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.price.toLocaleString()} ج.م للقطعة</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white p-1 rounded-full">
                  <button onClick={() => handleUpdateQuantity(item.id, -1)} className="p-1">
                    <MinusIcon className="w-5 h-5 text-red-500" />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, 1)} className="p-1">
                    <PlusIcon className="w-5 h-5 text-green-500" />
                  </button>
                </div>
                <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">لم يتم إضافة أي منتجات للسلة.</p>
        )}
      </div>

      {/* 🔹 محتويات الهدية */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">🎁 محتويات الهدية</h3>
        {state.cart.length > 0 ? (
          state.cart.map((item) => (
            <motion.div
              key={item.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-3"
            >
              <div className="flex items-center gap-4">
                <img src={item.data.image} alt={item.data.name} className="w-16 h-16 object-contain rounded-lg" />
                <div>
                  <h3 className="text-md font-semibold">{item.data.name}</h3>
                  <p className="text-gray-600">{item.data.price.toLocaleString()} ج.م للقطعة</p>
                </div>
              </div>
              <span className="font-medium text-gray-800">× {item.quantity}</span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">لم يتم إضافة أي منتجات داخل الهدية.</p>
        )}
      </div>

      {/* 🔹 صندوق الهدية والتغليف */}
      {state.selectedBox && (
        <motion.div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg mb-3">
          <img src={state.selectedBox.image} alt={state.selectedBox.name} className="w-16 h-16 object-contain rounded-lg" />
          <span className="text-md font-semibold">{state.selectedBox.name}</span>
        </motion.div>
      )}

      {state.selectedWrap && (
        <motion.div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg mb-3">
          <img src={state.selectedWrap.image} alt={state.selectedWrap.name} className="w-16 h-16 object-contain rounded-lg" />
          <span className="text-md font-semibold">{state.selectedWrap.name}</span>
        </motion.div>
      )}
 {/* 🔹 ملخص السعر */}
 <div className="bg-emerald-50 p-4 rounded-lg mb-6 flex justify-between">
        <h3 className="text-lg font-bold text-emerald-800">💰 الإجمالي النهائي:</h3>
        <p className="text-xl font-bold text-emerald-600">{calculateTotal().toLocaleString()} ج.م</p>
      </div>

      {/* 🔹 زر إرسال الطلب عبر واتساب */}

      <motion.div className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-lg transition-all">
        <Link href={createWhatsappOrder()} target="_blank" rel="noopener noreferrer">
          <span>📩 إرسال الطلب عبر واتساب</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default GiftSummary;
