import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";

const tabs = [
  { label: "Vật phẩm", value: "items" },
  { label: "Kho vật phẩm của bạn", value: "inventory" },
  { label: "Lịch sử đổi vật phẩm", value: "history" },
];

export default function RedeemPage() {
  const baseURL = import.meta.env.VITE_API_URL;
  const [tab, setTab] = useState("items");
  const user = useSelector((state) => state.auth?.login?.currentUser?.data);
  const userID = user?.account?.id;
  const navigate = useNavigate();
  const [point, setPoint] = useState(0);

  const fetchPoint = async () => {
    try {
      const response = await fetch(`${baseURL}/user/point/${userID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      })
      const json = await response.json();
      setPoint(json.data);
    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };


  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    fetchPoint();
  }, []);

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-r from-[#0B2B28] to-[#2B2B2B] text-white">
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Đổi điểm</h1>
          <p className="text-gray-300 mb-3">
            Đổi điểm lấy vật phẩm hấp dẫn, ưu đãi đặc biệt dành cho bạn!
          </p>
          <div className="flex items-center gap-2 text-lg">
            <span className="font-semibold">Điểm hiện tại:</span>
            <span className="text-yellow-400 font-bold text-xl">{point}</span>
            <span className="text-gray-400">điểm</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 border-b border-gray-600">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-6 py-2 text-lg font-semibold transition rounded-t-md ${tab === t.value
                ? "bg-yellow-400 text-black shadow"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          {tab === "items" && <RedeemItems fetchPoint={fetchPoint} />}
          {tab === "inventory" && <RedeemInventory />}
          {tab === "history" && <RedeemHistory />}
        </div>
      </div>
    </div>
  );
}

function RedeemItems({ fetchPoint }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [inputPage, setInputPage] = useState(1);
  const location = useLocation();
  const user = useSelector((state) => state.auth?.login?.currentUser?.data);
  const baseURL = import.meta.env.VITE_API_URL;

  const fetchItems = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/items/getAllForUser?page=${page - 1}&size=3`, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
      const json = await response.json();
      if (json.data) {
        console.log("json.data", json.data.content);
        setItems(json.data.content);
        setTotalPages(json.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Có lỗi khi tải danh sách vật phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.accessToken) {
      fetchItems(currentPage);
      setInputPage(currentPage);
    }
  }, [currentPage, user?.accessToken]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setInputPage(page);
    }
  };

  const handleRedeem = async (accountId, itemId) => {
    if (isRedeeming) return;
    setIsRedeeming(true);
    try {
      const response = await fetch(`${baseURL}/exchange`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify({ accountId, itemId }),
      });
      const json = await response.json();

      if (json.code === 200) {
        toast.success("Đổi vật phẩm thành công!");
        await fetchItems(currentPage);
        await fetchPoint();
      } else {
        toast.error(json.message || "Đổi vật phẩm thất bại!");
      }
    } catch (error) {
      console.error("Error redeeming item:", error);
      toast.error("Có lỗi xảy ra khi đổi vật phẩm!");
    } finally {
      setIsRedeeming(false);
    }
  };

  if (isLoading) {
    return <Loading size="medium" />;
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#4B4F4F] hover:border-[#2ee59d] border border-[#4B4F4F] rounded-xl p-6 w-72 text-center shadow-lg transition-all duration-200 relative"
            >
              <div className="absolute top-2 right-2 flex items-center justify-center bg-gradient-to-tr from-yellow-400 to-yellow-300 text-black px-3 py-1 rounded-full text-xs font-extrabold shadow-lg border-2 border-white min-w-[36px] min-h-[28px]">
                <span className="mr-1">X</span>
                {item.quantity}
              </div>

              <img
                src={item.link}
                alt={item.name}
                className="w-20 h-20 mb-3 object-cover mx-auto rounded-full"
              />
              <div className="font-bold mb-1 text-white text-lg">{item.name}</div>
              <div className="font-bold mb-1 text-yellow-300 text-sm">Giảm {item.voucherValue.toLocaleString()
                            } {item.voucherType === "PERCENT" ? "%" : "VNĐ"}</div>
              <div className="mb-3 text-yellow-300 font-semibold">{item.point} điểm</div>
              <button onClick={() => handleRedeem(user?.account?.id, item.id)} className="bg-yellow-400 text-black px-5 py-2 rounded font-bold hover:bg-yellow-300 transition duration-200">
                Đổi ngay
              </button>
            </div>
          ))}
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
              type="number"
              value={inputPage}
              min={1}
              max={totalPages}
              onChange={e => setInputPage(Number(e.target.value))}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  let value = Number(e.target.value);
                  value = value > totalPages ? totalPages : value < 1 ? 1 : value;
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
    </>
  );
}

function RedeemInventory() {
  const baseURL = import.meta.env.VITE_API_URL;
  const user = useSelector((state) => state.auth?.login?.currentUser?.data);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${baseURL}/exchange/inventory/${user?.account?.id}`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        const json = await response.json();
        if (json.code === 200) {
          console.log('json.data', json.data);
          setInventory(json.data);
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.account?.id) {
      fetchInventory();
    }
  }, [user?.account?.id, user?.accessToken]);

  if (loading) {
    return <Loading size="medium" />;
  }

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
        {inventory.map((item) => (
          <div
            key={item.itemId}
            className="bg-[#4B4F4F] hover:border-[#2ee59d] border border-[#4B4F4F] rounded-xl p-6 w-72 text-center shadow-lg transition-all duration-200 relative"
          >
            <div className="absolute top-2 right-2 flex items-center justify-center bg-gradient-to-tr from-yellow-400 to-yellow-300 text-black px-3 py-1 rounded-full text-xs font-extrabold shadow-lg border-2 border-white min-w-[36px] min-h-[28px]">
              <span className="mr-1">X</span>
              {item.quantity}
            </div>

            <img
              src={item.itemImage}
              alt={item.itemName}
              className="w-20 h-20 mb-3 object-cover mx-auto rounded-full"
            />
            <div className="font-bold mb-1 text-white text-lg">{item.itemName}</div>
            <div className="font-bold mb-1 text-yellow-300 text-sm">Giảm {item.voucherValue.toLocaleString()
                            } {item.voucherType === "PERCENT" ? "%" : "VNĐ"}</div>
            <div className="mb-3 text-yellow-300 font-semibold">{item.pointUsed} điểm</div>
            <div className="mb-3 text-gray-400 text-sm">{(() => {
              const [year, month, day] = item.voucherEndDate.split("-");
              return `${day}-${month}-${year}`;
            })()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RedeemHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_API_URL;
  const user = useSelector((state) => state.auth?.login?.currentUser?.data);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${baseURL}/exchange/history/${user?.account?.id}`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        const json = await response.json();
        console.log("Exchange history:", json);
        if (json.code === 200) {
          setHistory(json.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exchange history:", error);
        setLoading(false);
      }
    };

    if (user?.account?.id) {
      fetchHistory();
    }
  }, [user?.account?.id, user?.accessToken]);

  if (loading) {
    return <Loading size="medium" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-3 px-4 text-gray-300">Vật phẩm</th>
            <th className="py-3 px-4 text-gray-300">Loại</th>
            <th className="py-3 px-4 text-gray-300">Ngày đổi</th>
            <th className="py-3 px-4 text-gray-300">Điểm đã dùng</th>
            <th className="py-3 px-4 text-gray-300">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((item) => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span>{item.itemName}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-sm ${item.itemType === 'voucher' ? 'bg-green-900 text-green-300' :
                    'bg-blue-900 text-blue-300'
                    }`}>
                    {item.itemType === 'voucher' ? 'Voucher' : 'Vật phẩm'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {new Date(item.exchangeDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="py-3 px-4">
                  <span className="text-yellow-400 font-semibold">
                    {item.pointUsed} điểm
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-sm ${item.status === 'SUCCESS' ? 'bg-green-900 text-green-300' :
                    item.status === 'FAILED' ? 'bg-red-900 text-red-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                    {item.status === 'SUCCESS' ? 'Thành công' :
                      item.status === 'FAILED' ? 'Thất bại' :
                        'Đang xử lý'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 px-4 text-center text-gray-400">
                Chưa có lịch sử đổi điểm
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}