
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LiaTimesCircle } from "react-icons/lia";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from 'react-toastify';
import DeleteDiscountConfirmModal from './DeleteDiscountConfirmModal';

const DiscountAdmin = () => {
  const [discounts, setDiscount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateNow, setDateNow] = useState(new Date());
  const inputRef = useRef(null);
  const location = useLocation();
  const user = useSelector((state) => state.auth.login?.currentUser.data)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountIDToDelete, setDiscountIDToDelete] = useState(null);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const openModal = (id) => {
    setDiscountIDToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDiscountIDToDelete(null);
  };
  const confirmDelete = async () => {
    if (discountIDToDelete) {
        try {
            const response = await fetch(`${baseURL}/discounts/delete/${discountIDToDelete}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user?.accessToken}`
                }
            });
            const json = await response.json();
            if (json.code === 1000) {
                toast.success("Xóa thành công")
                navigate("/admin/discounts")
            }
            else toast.error("Xóa thất bại")
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }
    closeModal();
};




  useEffect(() => {
    const fecthDiscount = async (page) => {
      try {
        if (inputRef.current) inputRef.current.value = page;
        const response = await fetch(`${baseURL}/discounts/getAll?page=${page - 1}&size=10`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`
          }
        })
        const json = await response.json();
        setDiscount(json.data.content);
        setTotalPages(json.data.totalPages);
        console.log("json", json.data.content);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fecthDiscount(currentPage)
  }, [currentPage, location]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="bg-main py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[#18B088] text-lg font-semibold">Tất cả Voucher</span>
          <NavLink to={'/admin/discounts/addDiscount'} >
            <button className="bg-[#18B088] text-white text-xl px-4 py-2 rounded-lg font-semibold hover:bg-[#128067] transition duration-200">
              Thêm Voucher
            </button>
          </NavLink>
        </div>
        <div >
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
            <table className="min-w-full bg-white border border-emerald-500 rounded-lg">
              <thead>
                <tr className="bg-emerald-500 text-black">
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold text-black">STT</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Mã voucher</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Loại</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Ngày bắt đầu</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Ngày kết thúc</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Số lượng</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Trạng thái</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {discounts?.map((discount, index) => (
                  <tr key={discount.id} className={"bg-gray-200 hover:bg-gray-100 transition duration-200"}>
                    <td className="py-3 px-4 border-b text-gray-800">{index + 1}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{discount.code}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{discount.type == "PERCENT" ? "Giảm giá theo phần trăm" : "Giảm giá cố định"}</td>
                    <td className="py-3 px-4 border-b text-gray-800">
                      {new Date(discount.startDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-800">
                      {new Date(discount.endDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-800">{discount.quantity}</td>
                    <td className="py-3 px-4 border-b text-gray-800">
                      {new Date(discount.endDate) > new Date() ?
                        <div className='text-emerald-400 text-3xl text-center'><CiCircleCheck /></div>
                        : <div className='text-red-700 text-3xl'><LiaTimesCircle /></div>}
                    </td>
                    <td className="py-3 px-4 border-b flex space-x-4">
                      <NavLink to={`/admin/discounts/updateDiscount/${discount?.id}`} state={{discount : discount}}  className="text-blue-500 hover:text-blue-700 font-bold transition duration-150">Update</NavLink>
                      {/* <button onClick={() => openModal(discount.id)} className={`text-red-500 hover:text-red-700 font-bold transition duration-150 `} >Delete</button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center mt-10 ">
          <button
            className="px-4 py-2 bg-[#34D399] text-black font-bold rounded-lg hover:bg-[#34D399]/90 transition-all duration-300 shadow-lg hover:shadow-[#34D399]/50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-bold bg-gray-900 mx-4 px-4 py-2 border-2 border-[#34D399] text-[#34D399] font-bold rounded-lg hover:bg-[#34D399]/10 transition-all duration-300">
            Page
            <input
              className="mx-4 w-16 text-center p-1 w-10 border border-[#34D399] rounded"
              ref={inputRef}
              type="number"
              name="price"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = (e.target.value > totalPages) ? totalPages : ((e.target.value < 1) ? 1 : e.target.value)
                  handlePageChange(value);
                }
              }}
            />
            of {totalPages} </span>
          <button
            className="px-4 py-2 bg-[#34D399] text-black font-bold rounded-lg hover:bg-[#34D399]/90 transition-all duration-300 shadow-lg hover:shadow-[#34D399]/50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      {/* <DeleteDiscountConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      /> */}
    </div>
  )
}

export default DiscountAdmin