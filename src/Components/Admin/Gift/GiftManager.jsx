
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LiaTimesCircle } from "react-icons/lia";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from 'react-toastify';


const GiftManager = () => {
  const [gifts, setGift] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateNow, setDateNow] = useState(new Date());
  const inputRef = useRef(null);
  const location = useLocation();
  const user = useSelector((state) => state.auth.login?.currentUser.data)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [giftIDToDelete, setgiftIDToDelete] = useState(null);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const openModal = (id) => {
    setgiftIDToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setgiftIDToDelete(null);
  };
//   const confirmDelete = async () => {
//     if (giftIDToDelete) {
//         try {
//             const response = await fetch(`${baseURL}/gifts/delete/${giftIDToDelete}`, {
//                 method: "DELETE",
//                 headers: {
//                     Authorization: `Bearer ${user?.accessToken}`
//                 }
//             });
//             const json = await response.json();
//             if (json.code === 1000) {
//                 toast.success("Xóa thành công")
//                 navigate("/admin/gifts")
//             }
//             else toast.error("Xóa thất bại")
//         } catch (err) {
//             console.error('Error fetching data:', err);
//         }
//     }
//     closeModal();
// };




  useEffect(() => {
    const fecthgift = async (page) => {
      try {
        if (inputRef.current) inputRef.current.value = page;
        const response = await fetch(`${baseURL}/items/getAll?page=${page - 1}&size=10`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`
          }
        })
        const json = await response.json();
        setGift(json.data.content);
        setTotalPages(json.data.totalPages);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fecthgift(currentPage)
  }, [currentPage, location]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="bg-main py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[#18B088] text-lg font-semibold">Tất cả Vật phẩm</span>
          <NavLink to={'/admin/gifts/addgift'} >
            <button className="bg-[#18B088] text-white text-xl px-4 py-2 rounded-lg font-semibold hover:bg-[#128067] transition duration-200">
              Thêm Gift
            </button>
          </NavLink>
        </div>
        <div >
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
            <table className="min-w-full bg-white border border-emerald-500 rounded-lg">
              <thead>
                <tr className="bg-emerald-500 text-black">
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold text-black">STT</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Loại vật phẩm</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Tên vật phẩm</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Số điểm</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Số lượng</th>
                  <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {gifts?.map((gift, index) => (
                  <tr key={gift.id} className={"bg-gray-200 hover:bg-gray-100 transition duration-200"}>
                    <td className="py-3 px-4 border-b text-gray-800">{index + 1}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{gift.type == "VOUCHER" ? "VOUCHER" : "Quà tặng"}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{gift.name}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{gift.point}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{gift.quantity}</td>
                    <td className="py-3 px-4 border-b flex space-x-4">
                      <NavLink to={`/admin/gifts/updategift/${gift?.id}`} state={{gift : gift}}  className="text-blue-500 hover:text-blue-700 font-bold transition duration-150">Update</NavLink>
                      {/* <button onClick={() => openModal(gift.id)} className={`text-red-500 hover:text-red-700 font-bold transition duration-150 `} >Delete</button> */}
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
      {/* <DeletegiftConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      /> */}
    </div>
  )
}

export default GiftManager