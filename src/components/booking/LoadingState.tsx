
import React from "react";
import Layout from "@/components/layout/Layout";

const LoadingState = () => {
  return (
    <Layout hideNav>
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-barber-accent"></div>
      </div>
    </Layout>
  );
};

export default LoadingState;
