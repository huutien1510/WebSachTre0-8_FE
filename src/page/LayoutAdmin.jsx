import React, { useEffect } from 'react'
import Sidebar from '../Components/Admin/Sidebar.jsx'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const LayoutAdmin = () => {
  const user = useSelector((state) => state.auth?.login.currentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!(user.data.account.roles[0] === "ADMIN")) {
      navigate('*');
    }
  }, []);
  return (
    <div className='flex mt-16 bg-main'>
      <Sidebar />
      <section className='flex-1 bg-main p-8'>
        <Outlet />
      </section>
    </div>
  )
}

export default LayoutAdmin