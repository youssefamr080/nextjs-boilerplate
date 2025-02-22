"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import { products, Product } from "../../data/products";

interface SearchBarProps {
    onProductSelect?: (product: Product) => void; // دالة اختيار المنتج
}

const SearchBar: React.FC<SearchBarProps> = ({ onProductSelect }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    //✅ استخدام localstorage
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem("recentSearches") || "[]");
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
        }
    }, [recentSearches]);

    //✅ fuse options
    const fuseOptions = {
        keys: ["name", "category", "description", "tags"],
        threshold: 0.3,
    };

    const fuse = useRef<Fuse<Product> | null>(null);

    useEffect(() => {
        fuse.current = new Fuse(products, fuseOptions);
    }, [products]);

    //✅ دالة لتحديث نتائج البحث مع `debounce`
    const updateSearchResults = useCallback(
        debounce((value: string) => {
            if (fuse.current && value.length > 1) {
                const searchResults: Product[] = fuse.current.search(value).map((result) => result.item);
                setResults(searchResults);
            } else {
                setResults([]);
            }
        }, 300),
        []
    );

    //✅ دالة لتحديث شريط البحث
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        updateSearchResults(value);
    };

    //✅ اغلاق النتائج بالضغط علي الesc
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setQuery("");
                setResults([]);
                setIsFocused(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    //✅ التحقق اذا تم النقر خارج الصندوق ليتم اقفال مربع البحث
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ دالة لإضافة البحث إلى سجل البحث الحديث
    const addRecentSearch = (term: string) => {
        setRecentSearches(prev => {
            const newSearches = [term, ...prev.filter(t => t !== term)].slice(0, 5); // احتفظ بآخر 5 عمليات بحث فقط
            return newSearches;
        });
    };

    //✅
    const handleProductSelect = (product: Product) => {
        setQuery(product.name); //✅ عرض الاسم في مربع البحث
        setResults([]); // ✅ إخفاء النتائج
        setIsFocused(false); // ✅ إغلاق مربع البحث

        addRecentSearch(product.name);
        onProductSelect?.(product);

        //TODO اضافه التوجه لصفحة المنتج بعد اختياره من قائمه البحث
    };

    return (
        <div className="relative w-full max-w-lg" ref={searchRef}>
            {/* حقل البحث */}
            <div className="relative">
                <motion.input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    placeholder=" ابحث عن منتج..."
                    className="w-full px-4 py-2 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-inner"
                    ref={inputRef}
                />
                <motion.div
                    className="absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-gray-500 cursor-pointer"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    onClick={() => inputRef.current?.focus()}
                    aria-label="بحث"
                >
                    <Search className="h-5 w-5" />
                </motion.div>
            </div>

            {/* ✅  قائمة عمليات البحث الاخيره */}
            <AnimatePresence>
                {isFocused && !results.length && recentSearches.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-full bg-white shadow-xl rounded-2xl z-50 border border-gray-200 max-h-52 overflow-y-auto"
                    >
                        {/*✅ عرض خاصيه الذاكره للمنتجات والبحث بناء عليها  */}
                        <p className="px-4 py-2 text-gray-500 text-sm">عمليات البحث الأخيرة</p>
                        {recentSearches.map(term => (
                            <button
                                key={term}
                                onClick={() => {
                                    setQuery(term);
                                    updateSearchResults(term);
                                }}
                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition w-full text-left"
                            >
                                <Search className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{term}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/*✅ قائمه عرض المنتجات  */}
            <AnimatePresence>
                {isFocused && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-full bg-white shadow-xl rounded-2xl z-50 border border-gray-200 max-h-64 overflow-y-auto"
                    >
                        {results.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                                onClick={() => handleProductSelect(product)} // ⭐️ عند اختيار المنتج
                            >
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={48} // تعيين عرض ثابت
                                    height={48} // تعيين ارتفاع ثابت
                                    className="object-cover rounded-md mr-3"
                                    unoptimized // ⭐️ منع تحسين الصورة لتحسين الأداء
                                />
                                <div>
                                    <p className="text-gray-800 font-medium">{product.name}</p>
                                    <p className="text-primary-600 font-semibold text-sm">
                                        {product.price.toLocaleString()} ج.م
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;