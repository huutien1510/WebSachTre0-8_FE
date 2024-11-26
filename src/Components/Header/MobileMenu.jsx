/* eslint-disable react/prop-types */

const MobileMenu = ({ menuItems }) => (
  <div className="md:hidden bg-black/90 backdrop-blur-md">
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      {menuItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="text-gray-300 hover:text-emerald-400 block px-3 py-2 text-base font-bold tracking-wide"
        >
          {item.name}
        </a>
      ))}
    </div>
    <div className="px-4 py-3 space-y-2">
      <button className="w-full bg-transparent border border-yellow-600 text-yellow-600 px-4 py-2 rounded-md text-sm font-bold hover:bg-yellow-600 hover:text-white transition-colors">
        Gói cước
      </button>
      <button className="w-full bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-emerald-600 transition-colors">
        Đăng ký
      </button>
      <button className="w-full bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-emerald-600 transition-colors">
        Đăng nhập
      </button>
    </div>
  </div>
);

export default MobileMenu;
