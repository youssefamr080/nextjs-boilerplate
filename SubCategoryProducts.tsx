import React, { useEffect } from "react";
import { products } from "../../data/products";
import BrandSwiper from "../../components/product/BrandSwiper";

const SubCategoryProducts = ({
  category,
  subCategory,
}: {
  category: string;
  subCategory: string;
}) => {
  // ✅ تصفية المنتجات بناءً على الفئة والفئة الفرعية
  const filteredProducts = products.filter(
    (p) =>
      p.category?.toLowerCase() === category?.toLowerCase() &&
      p.subCategory?.toLowerCase() === subCategory?.toLowerCase()
  );

  // ✅ استخراج البراندات الفريدة
  const brands: string[] = [
    ...new Set(filteredProducts.map((p) => p.brand).filter((b) => typeof b === "string" && b !== ""))
  ];

  // ✅ التحقق من البيانات عند التشغيل
  useEffect(() => {
    console.log("🔹 الفئة:", category);
    console.log("🔹 الفئة الفرعية:", subCategory);
    console.log("🔹 عدد المنتجات المطابقة:", filteredProducts.length);
    console.log("🔹 البراندات المتاحة:", brands);
  }, [category, subCategory]);

  return (
    <div className="container mx-auto my-6">
      {filteredProducts.length > 0 ? (
        brands.length > 0 ? (
          brands.map((brand) => {
            // ✅ تصفية المنتجات الخاصة بكل براند فقط
            const brandProducts = filteredProducts.filter((p) => p.brand === brand);

            return brandProducts.length > 0 ? (
              <BrandSwiper key={brand} brand={brand} products={brandProducts} />
            ) : null;
          })
        ) : (
          <p className="text-center text-gray-500 text-lg">⚠️ لا توجد براندات متاحة لهذا القسم</p>
        )
      ) : (
        <p className="text-center text-gray-500 text-lg">⚠️ لا توجد منتجات متاحة لهذا القسم حاليًا</p>
      )}
    </div>
  );
};

export default SubCategoryProducts;
