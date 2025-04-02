
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const NotFoundState = () => {
  const navigate = useNavigate();
  
  return (
    <Layout hideNav>
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Barber not found</h2>
        <button 
          onClick={() => navigate("/")} 
          className="barber-button"
        >
          Go Back Home
        </button>
      </div>
    </Layout>
  );
};

export default NotFoundState;
