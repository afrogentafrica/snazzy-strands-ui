
import React from "react";
import Layout from "@/components/layout/Layout";

const LoadingView = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center h-96">
        <p className="text-lg">Loading...</p>
      </div>
    </Layout>
  );
};

export default LoadingView;
