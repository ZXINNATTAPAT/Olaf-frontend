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
import { HomePage as Home } from './features/home';
import { 
  ProfilePage as Profile, 
  AddContentPage as Addcontent, 
  EditProfilePage as EditProfile 
} from './features/user';
import { AuthMiddleware, PersistLogin, Navbar, Loader } from './shared';

function App() {
  return (
    <>
      <Loader />
      <Navbar />
      
      <Routes>
        {/* ---------- Public routes ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/vFeed/:id" element={<View />} />
        
        {/* ---------- Auth routes ---------- */}
        <Route path="/auth/login" element={<Loginauth />} />
        <Route path="/auth/register" element={<Registerauth />} />

        {/* ---------- Protected routes ---------- */}
        <Route element={<PersistLogin />}>
          <Route element={<AuthMiddleware />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addcontent" element={<Addcontent />} />
            <Route path="/editContent/:post_id" element={<EditPost />} />
            <Route path="/editProfile/:user_id" element={<EditProfile />} />
            <Route path="/user" element={<User />} />
          </Route>
        </Route>

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
