export default function Footer() {
  return (
    <footer className="bg-white text-sm text-gray-700 border-t pt-10">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Về TJZenn */}
        <div>
          <h3 className="font-bold mb-3">Về TJZenn</h3>
          <ul className="space-y-1">
            <li>
              <a href="#">Giới thiệu</a>
            </li>
            <li>
              <a href="#">Tuyển dụng</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
          </ul>
        </div>

        {/* Chính sách */}
        <div>
          <h3 className="font-bold mb-3">Chính sách</h3>
          <ul className="space-y-1">
            <li>
              <a href="#">Chính sách bảo hành</a>
            </li>
            <li>
              <a href="#">Chính sách giao hàng</a>
            </li>
            <li>
              <a href="#">Chính sách bảo mật</a>
            </li>
          </ul>
        </div>

        {/* Thông tin */}
        <div>
          <h3 className="font-bold mb-3">Thông tin</h3>
          <ul className="space-y-1">
            <li>
              <a href="#">Hệ thống cửa hàng</a>
            </li>
            <li>
              <a href="#">Hướng dẫn mua hàng</a>
            </li>
            <li>
              <a href="#">Hướng dẫn thanh toán</a>
            </li>
            <li>
              <a href="#">Hướng dẫn trả góp</a>
            </li>
            <li>
              <a href="#">Tra cứu địa chỉ bảo hành</a>
            </li>
            <li>
              <a href="#">Build PC</a>
            </li>
          </ul>
        </div>

        {/* Tổng đài hỗ trợ */}
        <div>
          <h3 className="font-bold mb-3">
            Tổng đài hỗ trợ <span className="text-xs">(8:00 - 21:00)</span>
          </h3>
          <ul className="space-y-1">
            <li>
              Mua hàng:{" "}
              <a href="tel:19005301" className="text-blue-600 font-medium">
                0812.303.471
              </a>
            </li>

            <li>
              Email:{" "}
              <a
                href="mailto:contact.tjzenn@gmail.com"
                className="text-blue-600 font-medium"
              >
                contact.tjzenn@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto px-4 py-4 mt-4 text-center">
        <p className="text-gray-600">© 2025 TJZenn. All rights reserved.</p>
      </div>
    </footer>
  );
}
