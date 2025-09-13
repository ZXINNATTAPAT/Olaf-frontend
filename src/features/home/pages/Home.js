import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";

export default function Home() {
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
    <div className="min-vh-100 d-flex flex-column">
      <main
        className="flex-grow-1 d-flex align-items-center justify-content-center vh-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center">
          <h1
            className="display-1 fw-light mb-4 shadow-text"
            style={{
              fontSize: "4rem",
              letterSpacing: "0.1em",
              color: "#ffffff",
            }}
          >
            OLAF.
          </h1>
          <p
            className="lead mb-5 shadow-text"
            style={{
              fontSize: "1.25rem",
              color: "#ffffff",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Put your story ideas into words, for they may become the seeds of
            inspiration that help others grow
          </p>

          <button
            className="btn btn-outline-light btn-lg px-5 py-3"
            onClick={handleButtonClick}
            style={{
              borderRadius: "0",
              borderWidth: "2px",
              fontSize: "1.1rem",
              letterSpacing: "0.05em",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.color = "#2c3e50";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "white";
            }}
          >
            Start Writing
          </button>
        </div>
      </main>
    </div>
  );
}
