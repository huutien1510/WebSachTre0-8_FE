function Support() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="pt-0 pb-16 max-w-7xl mx-auto ">
        {/* Support Categories */}
        <div className="space-y-6">
          <div className="bg-gray-900/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Liên hệ trực tiếp</h3>
            <div className="space-y-4">
              <a
                href="tel:0877736289"
                className="flex items-center space-x-4 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="bg-green-500/10 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-500"
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
                </div>
                <div>
                  <div className="font-medium">Hotline</div>
                  <div className="text-gray-400 text-sm">0877736289</div>
                </div>
              </a>

              <a
                href="tel:1900545482"
                className="flex items-center space-x-4 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Tổng đài</div>
                  <div className="text-gray-400 text-sm">
                    1900545482 nhánh 5
                  </div>
                </div>
              </a>

              <a
                href="mailto:support@waka.vn"
                className="flex items-center space-x-4 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="bg-purple-500/10 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-purple-500"
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
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-400 text-sm">support@waka.vn</div>
                </div>
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-900/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Câu hỏi thường gặp</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors">
                <span>Làm thế nào để đặt lại mật khẩu?</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors">
                <span>Cách thanh toán trên ứng dụng</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors">
                <span>Chính sách hoàn tiền</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
