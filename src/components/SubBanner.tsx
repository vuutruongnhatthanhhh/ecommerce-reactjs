import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import bannerBlogImage from "@/assets/home-banner/banner-blog-home.webp";
import laptopImage from "@/assets/products/gaming1.png";
import gpuImage from "@/assets/products/gpu1.png";
import gearImage from "@/assets/products/gear1.png";

const tags = ["Hướng dẫn kỹ thuật", "Tin tức công nghệ", "Phụ kiện & Setup"];

const promoItems = [
  {
    title: "Laptop",
    subtitle: "Cấu hình khủng",
    image: laptopImage,
    bg: "bg-gradient-to-r from-blue-600 to-indigo-400",
  },
  {
    title: "GPU",
    subtitle: "Hiệu năng mạnh mẽ",
    image: gpuImage,
    bg: "bg-gradient-to-r from-rose-500 to-orange-400",
  },
  {
    title: "GEAR",
    subtitle: "Giá cả phù hợp",
    image: gearImage,
    bg: "bg-gradient-to-r from-red-500 to-pink-500",
  },
];

export default function BlogBannerHome() {
  return (
    <section className="my-12">
      <div className="flex flex-col lg:flex-row items-center gap-6 p-6 rounded-xl bg-white shadow border">
        <img
          src={bannerBlogImage}
          alt="Microsoft Accessories"
          className="max-w-sm w-full object-contain"
        />
        <div className="space-y-4 text-center lg:text-left">
          <h2 className="text-3xl font-bold leading-tight  cursor-pointer">
            Xu thế công nghệ mới nhất từ TJZenn
          </h2>
          <p className="text-gray-500">
            Khám phá kiến thức công nghệ mới nhất cùng TJZenn – nơi chia sẻ đánh
            giá, tư vấn mua sắm laptop, GPU, bàn phím, chuột và phụ kiện chuẩn
            tín đồ công nghệ!
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
        {promoItems.map((item, i) => (
          <div
            key={i}
            className={`rounded-xl text-black flex items-center justify-between p-4 bg-[#E6EFFD]`}
          >
            <div>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm mb-3">{item.subtitle}</p>
              <Button
                variant="secondary"
                className="text-white bg-blue-600 hover:bg-blue-700"
              >
                Xem chi tiết
              </Button>
            </div>
            <img
              src={item.image}
              alt={item.title}
              className="w-32 h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
