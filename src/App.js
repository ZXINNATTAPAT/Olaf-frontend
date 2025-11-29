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
  UserPage as User,
  HomePage as Home,
  ProfilePage as Profile,
  AddContentPage as Addcontent,
  EditProfilePage as EditProfile,
  AdminDashboard,
  PostsManagement,
  UsersManagement,
  CommentsManagement,
  Analytics,
  Settings
} from './pages';
import { AuthMiddleware, PersistLogin, NavbarWrapper, Loader, AdminMiddleware } from './shared';

function App() {
  return (
    <div style={{ paddingTop: '76px' }}>
      <Loader />
      <NavbarWrapper />
      
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

        {/* ---------- Admin routes ---------- */}
        <Route element={<PersistLogin />}>
          <Route element={<AuthMiddleware />}>
            <Route element={<AdminMiddleware />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/posts" element={<PostsManagement />} />
              <Route path="/admin/users" element={<UsersManagement />} />
              <Route path="/admin/comments" element={<CommentsManagement />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>
        </Route>

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
