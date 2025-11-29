import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (!user.email) {
      navigate("/auth/login");
    } else {
      navigate("/feed");
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      }}
    >
      <div className="text-center px-4">
        <h1 className="text-6xl md:text-7xl font-light mb-6 text-white drop-shadow-lg tracking-wider">
          OLAF.
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-lg max-w-lg mx-auto leading-relaxed">
          Put your story ideas into words, for they may become the seeds of
          inspiration that help others grow
        </p>
        <button
          onClick={handleButtonClick}
          className="px-8 py-4 text-lg border-2 border-white text-white bg-transparent rounded-none tracking-wide transition-all duration-300 hover:bg-white hover:text-black"
        >
          Start Writing
        </button>
      </div>
    </main>
  );
}

