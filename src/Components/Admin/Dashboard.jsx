import React, { useEffect, useState } from 'react'

const Dashboard = () => {
    const [totalBooks, setTotalBooks] = useState(0)
    const [totalView, setTotalView] = useState(0)
    const [price, setPrice] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/books/total')
                const data = await response.json()
                setTotalBooks(data.data)

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [totalBooks])
    useEffect(() => {
        const fetchView = async () => {
            try {
                const response = await fetch('http://localhost:8080/chapters/totalView')
                const data = await response.json()
                setTotalView(data.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchView()
        const fetchPrice = async () => {
            try {
                const response = await fetch('http://localhost:8080/orders/totalPrice')
                const data = await response.json()
                setPrice(data.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchPrice()
    }
        , [])
    return (
        <>
            <main>
                <h1 className='text-white mb-4 text-2xl'>DashBoard</h1>

                <ul className="box-info grid grid-cols-3 gap-4 mb-6">
                    <li className="flex items-center bg-white p-4 shadow rounded">
                        <i className="bx bxs-calendar-check text-blue-500 text-3xl mr-4"></i>
                        <div>
                            <h3 className="text-xl font-bold">{totalBooks}</h3>
                            <p>Số truyện</p>
                        </div>
                    </li>
                    <li className="flex items-center bg-white p-4 shadow rounded">
                        <i className="bx bxs-group text-green-500 text-3xl mr-4"></i>
                        <div>
                            <h3 className="text-xl font-bold">{totalView}</h3>
                            <p>Số lượt xem</p>
                        </div>
                    </li>
                    <li className="flex items-center bg-white p-4 shadow rounded">
                        <i className="bx bxs-dollar-circle text-yellow-500 text-3xl mr-4"></i>
                        <div>
                            <h3 className="text-xl font-bold">{price} VNĐ</h3>
                            <p>Doanh thu</p>
                        </div>
                    </li>
                </ul>
            </main>
        </>
    )
}

export default Dashboard