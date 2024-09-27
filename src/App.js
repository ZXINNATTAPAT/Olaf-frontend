import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Home from './pages/Home';
// import About from './components/About';
// import Contact from './components/Contact';
// import Login from './authutication/Login';
// import Register from './authutication/Register';
import Feed from './pages/Feed';
import View from './posts/View/Views';
import AuthMiddleware from './middleware/Auth';
import Loginauth from './authutication/Loginauth';
import Registerauth from './authutication/Registerauth';
// import Home from './views/Home';
import User from './authutication/userauth';
import PersistLogin from './components/PersistLogin';
import Hometest from './pages/Hometest';
import Navbar from './components/Nav/Navbar';
// import ProtectedRoute from './authutication/ProtectedRoute';


function App() {
  return <>
    {/* เรียกใช้งาน Navbar ซึ่งเป็น navigation bar สำหรับแอป */}
    <Navbar />
    
    {/* การกำหนดเส้นทาง (Routing) สำหรับหน้าเว็บ */}
    <Routes>

      {/* เส้นทางหลัก '/' จะทำงานร่วมกับ PersistLogin เพื่อคงสถานะการล็อกอินไว้ */}
      <Route path='/' element={<PersistLogin />}>

        {/* หน้าแรกที่จะแสดงคือ Hometest */}
        <Route index exact element={<Hometest />}></Route>

        {/* เส้นทางสำหรับการเข้าสู่ระบบและการลงทะเบียน */}
        <Route path='/auth'>

          {/* เส้นทางย่อยสำหรับหน้า Login */}
          <Route path='login' element={<Loginauth />}></Route>

          {/* เส้นทางย่อยสำหรับหน้า Register */}
          <Route path='register' element={<Registerauth />}></Route>

          {/* เส้นทางย่อย 'user' จะทำงานร่วมกับ AuthMiddleware 
              เพื่อตรวจสอบการล็อกอินก่อนให้เข้าถึง User ได้ */}
          <Route path='user' element={<AuthMiddleware />}>
            <Route index element={<User />}></Route>
          </Route>

        </Route>

        {/* เส้นทาง Feed จะทำงานร่วมกับ AuthMiddleware เพื่อป้องกันไม่ให้ผู้ใช้ที่ไม่ได้ล็อกอินเข้าถึง Feed */}
        <Route element={<AuthMiddleware />}>
          <Route path="Feed" element={<Feed />} />
        </Route>

      </Route>

      {/* เส้นทาง fallback: ถ้าผู้ใช้เข้าถึงเส้นทางที่ไม่ถูกต้อง จะถูกนำไปยังหน้าแรก '/' */}
      <Route path='*' element={<Navigate to='/' />}></Route>
    </Routes>
  </>
}


export default App;

