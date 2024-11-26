function Footer() {
  return (
    <footer className="bg-[#1F1F1F] text-gray-300 py-6 md:py-8 ">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Company Info */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h2 className="text-[#4CD7A3] text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              MANGACOMIC
            </h2>
            <p className="text-xs md:text-sm mb-2">
              Công ty cổ phần sách điện tử MangaComic
            </p>
            <div className="flex items-center gap-2 mb-2 text-xs md:text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>0877736289</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Support@mangacomic.vn</span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="col-span-1">
            <h3 className="font-medium mb-2 md:mb-4 text-sm md:text-base">
              Về chúng tôi
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li className="hover:text-[#4CD7A3] cursor-pointer">
                Giới thiệu
              </li>
              <li className="hover:text-[#4CD7A3] cursor-pointer">
                Cơ cấu tổ chức
              </li>
              <li className="hover:text-[#4CD7A3] cursor-pointer">
                Lĩnh vực hoạt động
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-2 md:mb-4 text-sm md:text-base">
              Cơ hội
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li className="hover:text-[#4CD7A3] cursor-pointer">
                Cơ hội đầu tư
              </li>
              <li className="hover:text-[#4CD7A3] cursor-pointer">
                Tuyển dụng
              </li>
              <li className="hover:text-[#4CD7A3] cursor-pointer">Liên hệ</li>
              <li className="hover:text-[#4CD7A3] cursor-pointer">
                Dịch vụ xuất bản sách
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-medium mb-2 md:mb-4 text-sm md:text-base">
              Thông tin hữu ích
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li className="hover:text-[#4CD7A3] cursor-pointer">
                Thỏa thuận sử dụng dịch vụ
              </li>
              <li className="hover:text-[#4CD7A3] cursor-pointer">Quyền lợi</li>
              <li className="hover:text-[#4CD7A3] cursor-pointer">
                Quy định riêng tư
              </li>
              <li className="hover:text-[#4CD7A3] cursor-pointer">
                Câu hỏi thường gặp
              </li>
            </ul>
          </div>
        </div>

        {/* Company Details */}
        <div className="text-[10px] md:text-xs space-y-1.5 md:space-y-2 border-t border-gray-700 pt-4 md:pt-6">
          <p className="leading-relaxed">
            Công ty Cổ phần Sách điện tử Waka - Tầng 6, tháp văn phòng quốc tế
            Hòa Bình, số 106, đường Hoàng Quốc Việt, phường Nghĩa Đô, Quận Cầu
            Giấy, thành phố Hà Nội, Việt Nam.
          </p>
          <p className="leading-relaxed">
            ĐKKD số 0108796796 do SKHĐT TP Hà Nội cấp ngày 24/06/2019
          </p>
          <p className="leading-relaxed">
            Giấy xác nhận Đăng ký hoạt động phát hành xuất bản phẩm điện tử số
            8132/XN-CXBIPH do Cục Xuất bản, In và Phát hành cấp ngày 31/12/2019
          </p>
          <p className="leading-relaxed">
            Giấy chứng nhận Đăng ký cung cấp dịch vụ nội dung thông tin trên
            mạng Viễn thông di động số 19/GCN-DĐ do Cục Phát thanh, truyền hình
            và thông tin điện tử ký ngày 11/03/2020
          </p>
          <p className="leading-relaxed">
            Số VPGD: 024.73086566 | Số CSKH: 19005454821 nhánh 5 | Hotline:
            0877736289
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
