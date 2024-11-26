function AccountLink() {
  return (
    <div className="flex flex-col lg:flex-row ">
      <div className="ml-0">
        {/* Google Account */}
        <div className=" p-4 mb-4 bg-gray-900 rounded-lg w-[500px]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-600">G</span>
            </div>
            <div>
              <h3 className="text-white">Google</h3>
              <p className="text-gray-400 text-sm">Nguyễn Dương Thế Vĩ</p>
            </div>
          </div>
        </div>

        {/* Facebook Account */}
        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg  w-[500px]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-400">f</span>
            </div>
            <div>
              <h3 className="text-white">Facebook</h3>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors">
            Kết nối
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountLink;
