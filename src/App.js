import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  FeedPage as Feed, 
  ViewPage as View, 
  EditPostPage as EditPost 
} from './features/posts';
import { 
  LoginPage as Loginauth, 
  RegisterPage as Registerauth, 
  UserPage as User 
} from './features/auth';
import { 
  HomePage as Home 
} from './features/home';
import { 
  ProfilePage as Profile, 
  AddContentPage as Addcontent, 
  EditProfilePage as EditProfile 
} from './features/user';
import { 
  AuthMiddleware, 
  PersistLogin, 
  Navbar,
  Loader
} from './shared';


function App() {
  
  return <>
    <Loader />
    <Navbar />
    
    {/* การกำหนดเส้นทาง (Routing) สำหรับหน้าเว็บ */}
    <Routes>
    
      {/* เส้นทางหลัก '/' จะทำงานร่วมกับ PersistLogin เพื่อคงสถานะการล็อกอินไว้ */}
      <Route path='/' element={<PersistLogin />}>

        {/* หน้าแรกที่จะแสดงคือ Hometest */}
        <Route index exact element={<Home />}></Route>

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

          <Route path='/Feed' element={<Feed />} />

          <Route path='/profile' element={<Profile />}/>

          {/* เพิ่มPost content */}
          <Route path='/addcontent' element={<Addcontent />}/>
          <Route path='/editContent/:post_id' element={<EditPost />}/>
          <Route path='/editProfile/:user_id' element={<EditProfile />}/>


        </Route>

        <Route path='/vFeed/:id' element={<View />}></Route>


      </Route>
      

      {/* เส้นทาง fallback: ถ้าผู้ใช้เข้าถึงเส้นทางที่ไม่ถูกต้อง จะถูกนำไปยังหน้าแรก '/' */}
      <Route path='*' element={<Navigate to='/auth/login' />}></Route>
    </Routes>
  </>
}


export default App;

