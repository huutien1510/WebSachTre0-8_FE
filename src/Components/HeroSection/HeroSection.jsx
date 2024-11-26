function HeroSection() {
  return (
    <div className="relative min-h-[60vh] bg-black overflow-hidden flex items-center">
      {/* Animated Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute w-52 h-52 -top-10 -left-10 bg-[#34D399]/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute w-52 h-52 -bottom-10 -right-10 bg-[#34D399]/20 rounded-full blur-2xl animate-pulse delay-700" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-5 lg:px-6 py-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Khám phá thế giới sách cùng{" "}
          <span className="text-[#34D399]">MANGACOMIC</span>
        </h1>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
          Thư viện số với hơn 10,000+ đầu sách chọn lọc, từ sách văn học đến
          kiến thức chuyên ngành. Đọc sách mọi lúc, mọi nơi trên mọi thiết bị.
        </p>

        <div className="flex justify-center gap-3 mb-6">
          <button className="px-4 py-2 bg-[#34D399] text-black font-bold rounded-lg hover:bg-[#34D399]/90 transition-all duration-300 shadow-lg hover:shadow-[#34D399]/50">
            Bắt đầu đọc ngay
          </button>
          <button className="px-4 py-2 border-2 border-[#34D399] text-[#34D399] font-bold rounded-lg hover:bg-[#34D399]/10 transition-all duration-300">
            Xem thư viện
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-[#34D399]">10K+</div>
            <div className="text-gray-400">Đầu sách</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#34D399]">50K+</div>
            <div className="text-gray-400">Độc giả</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#34D399]">99%</div>
            <div className="text-gray-400">Hài lòng</div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 p-4 rounded-lg transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-8 h-8 bg-[#34D399]/20 rounded-lg flex items-center justify-center mb-2">
              <svg
                className="w-4 h-4 text-[#34D399]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Đọc Offline</h3>
            <p className="text-gray-400 text-xs">
              Tải sách và đọc mọi lúc, mọi nơi không cần kết nối internet
            </p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-8 h-8 bg-[#34D399]/20 rounded-lg flex items-center justify-center mb-2">
              <svg
                className="w-4 h-4 text-[#34D399]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Ghi chú thông minh
            </h3>
            <p className="text-gray-400 text-xs">
              Đánh dấu, ghi chú và chia sẻ những đoạn văn yêu thích
            </p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-8 h-8 bg-[#34D399]/20 rounded-lg flex items-center justify-center mb-2">
              <svg
                className="w-4 h-4 text-[#34D399]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Đa nền tảng</h3>
            <p className="text-gray-400 text-xs">
              Sử dụng trên điện thoại, máy tính bảng và máy tính cá nhân
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
