import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import laptopImage from "@/assets/home-banner/laptop-gaming.png";
import gpuImage from "@/assets/home-banner/gpu.png";
import gearImage from "@/assets/home-banner/gear.png";

const slides = [
  {
    title: "TJZenn săn deal hời rinh quà ngay",
    description:
      "Trang bị chiến thần công nghệ cho bạn! Laptop xịn – giá hời, hiệu năng đỉnh – deal bất bại. Đến ngay TJZenn để săn sale và nhận quà liền tay",
    buttonText: "Khám phá ngay",
    imageUrl: laptopImage,
  },
  {
    title: "Hiệu năng bùng nổ",
    description:
      "Render nhanh, training AI mượt, làm thiết kế 3D như gió với GPU cực đỉnh. Render nhanh, training AI mượt, làm thiết kế 3D như gió với GPU cực đỉnh.",
    buttonText: "Xem các dòng GPU hot",
    imageUrl: gpuImage,
  },
  {
    title: "Gõ chất – Click mượt cùng gear xịn",
    description:
      "Từ cảm giác gõ êm ái đến độ nhạy từng cú click – bàn phím cơ và chuột gaming tại TJZenn sẽ nâng tầm trải nghiệm làm việc lẫn chiến game. Đa dạng mẫu mã, giá cực ngon, sắm liền tay thôi!",
    buttonText: "Khám phá chuột & bàn phím",
    imageUrl: gearImage,
  },
];

export default function HomeBanner() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
  };

  useEffect(() => {
    startAutoSlide(); // Start when mounted
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Whenever slide changes (by auto or click), restart interval
  useEffect(() => {
    startAutoSlide();
  }, [current]);

  return (
    <div className="flex justify-center px-4">
      <div className="max-w-screen-xl w-full bg-gradient-to-r bg-[#E6EFFD] text-black px-6 py-12 rounded-lg overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex md:flex-row flex-col gap-8 w-full items-center"
            >
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold">{slides[current].title}</h2>
                <p className="text-lg">{slides[current].description}</p>
                <Button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded font-medium hover:bg-blue-700 transition">
                  {slides[current].buttonText}
                </Button>
              </div>
              <div className="flex-1">
                <img
                  src={slides[current].imageUrl}
                  alt="Slide"
                  className="w-full max-w-xs mx-auto rounded-lg"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot Indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: "8px",
                height: "8px",
                padding: 0,
                border: "none",
                background: i === current ? "blue" : "gray",
                borderRadius: "9999px",
                outline: "none",
                transition: "all 0.3s ease-in-out",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
