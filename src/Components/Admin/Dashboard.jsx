// pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import RevenueChart from '../Charts/RevenueChart';
import { Select, DatePicker, Radio } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Dashboard = () => {
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalView, setTotalView] = useState(0);
    const [price, setPrice] = useState(0);
    const [revenueData, setRevenueData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [viewMode, setViewMode] = useState('month');
    const [loading, setLoading] = useState(false);
    const baseURL = import.meta.env.VITE_API_URL;


    const years = Array.from(
        { length: new Date().getFullYear() - 2019 },
        (_, i) => 2020 + i
    );

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [booksRes, viewsRes, priceRes] = await Promise.all([
                fetch(`${baseURL}/books/total`),
                fetch(`${baseURL}/chapters/totalView`),
                fetch(`${baseURL}/orders/totalPrice`)
            ]);

            const [booksData, viewsData, priceData] = await Promise.all([
                booksRes.json(),
                viewsRes.json(),
                priceRes.json()
            ]);

            setTotalBooks(booksData.data);
            setTotalView(viewsData.data);
            setPrice(priceData.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRevenueData = async () => {
        try {
            let response;
            switch (viewMode) {
                case 'day': {
                    const year = selectedMonth.year();
                    const month = selectedMonth.month() + 1; // dayjs month is 0-based
                    response = await fetch(`${baseURL}/orders/daily-revenue/${year}/${month}`);
                    break;
                }
                case 'month':
                    response = await fetch(`${baseURL}/orders/monthly-revenue/${selectedYear}`);
                    break;
                case 'year':
                    response = await fetch(`${baseURL}/orders/yearly-revenue`);
                    break;
                default:
                    return;
            }
            const data = await response.json();
            setRevenueData(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error('Error fetching revenue data:', error);
            setRevenueData([]);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        fetchRevenueData();
    }, [viewMode, selectedYear, selectedMonth]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const getChartTitle = () => {
        switch (viewMode) {
            case 'day':
                return `Doanh số theo ngày của tháng ${selectedDate.format('MM/YYYY')}`;
            case 'month':
                return `Doanh số theo tháng năm ${selectedYear}`;
            case 'year':
                return 'Doanh số theo năm';
            default:
                return '';
        }
    };

    const getDaysInMonth = (year, month) => {
        return dayjs(`${year}-${month}-01`).daysInMonth();
    };

    const normalizeRevenueData = () => {
        if (!Array.isArray(revenueData)) return [];
        if (viewMode === 'day') {
            const year = selectedMonth.year();
            const month = selectedMonth.month() + 1;
            const daysInMonth = getDaysInMonth(year, month);
            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            const dataByDay = {};
            revenueData.forEach(item => {
            
                dataByDay[item.day] = item.total || 0;
            });
            return days.map(day => ({
                date: `${day}`,
                total: dataByDay[day] || 0
            }));
        }
        if (viewMode === 'month') {
            // 12 tháng
            const months = Array.from({ length: 12 }, (_, i) => i + 1);
            const dataByMonth = {};
            revenueData.forEach(item => {
            
                const month = item.month || item._id || item.label; 
                dataByMonth[month] = item.total || 0;
            });
            return months.map(month => ({
                month: month,
                total: dataByMonth[month] || 0
            }));
        }
     
        return revenueData;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <div className="flex items-center gap-4">
                    {viewMode === 'day' && (
                        <DatePicker
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                            picker="month"
                            format="MM/YYYY"
                        />
                    )}

                    {viewMode === 'month' && (
                        <Select
                            value={selectedYear}
                            onChange={setSelectedYear}
                            style={{ width: 120 }}
                            options={years.map(year => ({
                                value: year,
                                label: year.toString()
                            }))}
                        />
                    )}

                    <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)}>
                        <Radio.Button value="day">Theo ngày</Radio.Button>
                        <Radio.Button value="month">Theo tháng</Radio.Button>
                        <Radio.Button value="year">Theo năm</Radio.Button>
                    </Radio.Group>

                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingOutlined style={{ fontSize: 24 }} spin />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                                    <i className="bx bxs-book text-2xl"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-gray-500 text-sm">Tổng số truyện</p>
                                    <p className="text-2xl font-semibold">{totalBooks}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-500">
                                    <i className="bx bxs-show text-2xl"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-gray-500 text-sm">Tổng lượt xem</p>
                                    <p className="text-2xl font-semibold">{totalView.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                                    <i className="bx bxs-dollar-circle text-2xl"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-gray-500 text-sm">Tổng doanh thu</p>
                                    <p className="text-2xl font-semibold">{formatCurrency(price)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <RevenueChart
                            data={normalizeRevenueData()}
                            viewMode={viewMode}
                            title={getChartTitle()}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;